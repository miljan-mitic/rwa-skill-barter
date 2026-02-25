import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from 'src/entities/offer.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { FilterOfferDto } from '../dtos/filter-offer.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';
import { CreateOfferDto } from '../dtos/create-offer.dto';
import { User } from 'src/entities/user.entity';
import { UserSkillService } from 'src/modules/user-skill/services/user-skill.service';
import { UpdateOfferDto } from '../dtos/update-offer.dto';
import { removeUndefinedAttributes } from 'src/common/utils/remove-undefined-attributes';
import { OFFER_STATUS } from 'src/common/enums/offer-status.enum';
import { UserSkill } from 'src/entities/user-skill.entity';
import { OFFER_REQUEST_STATUS } from 'src/common/enums/offer-request-status.enum';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly userSkillService: UserSkillService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const { userSkillId, ...createOfferData } = createOfferDto;

    const userSkill = await this.userSkillService.findById(userSkillId, {
      user: true,
      skill: {
        category: true,
      },
    });

    if (userSkill.user.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const newOffer = this.offerRepository.create({
      ...createOfferData,
      userSkill,
    });

    try {
      await this.offerRepository.save(newOffer);
    } catch (error) {
      console.warn('OFFER SERVICE - CREATE OFFER:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
    return newOffer;
  }

  async findById(id: number, relations?: FindOptionsRelations<Offer>) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations,
    });
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }
    return offer;
  }

  async updateOffer(user: User, id: number, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offerRepository.findOne({
      where: { id, userSkill: { user: { id: user.id } } },
      relations: { userSkill: { skill: { category: true } } }, // ['userSkill.skill.category'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.status === OFFER_STATUS.ARCHIVED) {
      throw new BadRequestException('Archived offer cannot be updated');
    }

    const filteredDto = removeUndefinedAttributes(updateOfferDto);
    Object.assign(offer, filteredDto);

    try {
      await this.offerRepository.save(offer);
    } catch (error) {
      console.warn('OFFER SERVICE - UPDATE OFFER:', error);
      throw new InternalServerErrorException('Unexpected error');
    }

    return offer;
  }

  async getOffers(user: User, filterOfferDto: FilterOfferDto) {
    const {
      userOffers,
      skillId,
      categoryId,
      status,
      meetingType,
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterOfferDto;

    const queryBuilder = this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.userSkill', 'userSkill')
      .leftJoinAndSelect('userSkill.user', 'user')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('skill.category', 'category');
    if (userOffers !== undefined) {
      if (!userOffers) {
        queryBuilder
          .addSelect(
            `
    EXISTS (
      SELECT 1
      FROM offer_request orq
      JOIN user_skill us ON us.id = orq."userSkillId"
      WHERE orq."offerId" = offer.id
        AND us."userId" = :currentUserId
    )
  `,
            'hasCurrentUserRequest',
          )
          .setParameter('currentUserId', user.id);
      }
      queryBuilder.andWhere(
        `${userOffers ? 'userSkill.userId = :userId' : 'userSkill.userId != :userId'}`,
        { userId: user.id },
      );
    }

    if (skillId) {
      queryBuilder.andWhere('skill.id = :skillId', { skillId });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (status) {
      queryBuilder.andWhere('offer.status = :status', { status });
    }

    if (meetingType) {
      queryBuilder.andWhere('offer.meetingType = :meetingType', {
        meetingType,
      });
    }

    queryBuilder.orderBy(`offer.${sortBy}`, sortType);

    queryBuilder.skip(page * pageSize).take(pageSize);

    const [count, { entities, raw }] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getRawAndEntities(),
    ]);

    const items = entities.map((offer, index) => ({
      ...offer,
      hasCurrentUserRequest: raw[index].hasCurrentUserRequest,
    }));

    return {
      items,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
      currentPage: page,
    };
  }

  async getOfferById(user: User, id: number) {
    const { entities, raw } = await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.userSkill', 'userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('skill.category', 'category')
      .addSelect(
        `
  EXISTS (
    SELECT 1
    FROM offer_request orq
    WHERE orq."offerId" = offer.id
    AND orq.status = :status
  )
`,
        'hasAcceptedRequest',
      )
      .setParameter('status', OFFER_REQUEST_STATUS.ACCEPTED)
      .where('offer.id = :id', { id })
      .andWhere('userSkill.userId = :userId', { userId: user.id })
      .getRawAndEntities();

    const offer = entities[0];

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return {
      ...offer,
      hasAcceptedRequest: raw[0].hasAcceptedRequest,
    };
  }

  async deleteOffer(user: User, id: number) {
    return this.offerRepository.delete({
      id,
      userSkill: { user: { id: user.id } },
    });
  }

  async deleteMany(findOptionsWhere: FindOptionsWhere<Offer>) {
    return this.offerRepository.delete(findOptionsWhere);
  }
}
