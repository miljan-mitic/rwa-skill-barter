import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from 'src/entities/offer.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FilterOfferDto } from '../dtos/filter-offer.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';
import { CreateOfferDto } from '../dtos/create-offer.dto';
import { User } from 'src/entities/user.entity';
import { UserSkillService } from 'src/modules/user-skill/services/user-skill.service';
import { UpdateOfferDto } from '../dtos/update-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly userSkillService: UserSkillService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const { userSkillId, ...createOfferData } = createOfferDto;

    const userSkill = await this.userSkillService.findById(userSkillId);

    const newOffer = this.offerRepository.create({
      ...createOfferData,
      provider: user,
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

  async updateOffer(user: User, id: number, updateOfferDto: UpdateOfferDto) {
    const result = await this.offerRepository.update(
      {
        id,
        provider: { id: user.id },
      },
      updateOfferDto,
    );

    if (!result.affected) {
      throw new NotFoundException('Offer not found');
    }

    const offer = await this.offerRepository.findOne({
      where: { id, provider: { id: user.id } },
      relations: ['userSkill.skill.category'],
    });

    return offer;
  }

  async getOffers(filterOfferDto: FilterOfferDto) {
    const {
      skillId,
      categoryId,
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterOfferDto;

    const queryBuilder = this.offerRepository
      .createQueryBuilder('offer')
      .leftJoin('offer.userSkill', 'userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('skill.category', 'category');

    if (skillId) {
      queryBuilder.andWhere('skill.id = :skillId', { skillId });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    queryBuilder.orderBy(`offer.${sortBy}`, sortType);

    queryBuilder.skip(page * pageSize).take(pageSize);

    const [count, items] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getMany(),
    ]);

    return {
      items,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
      currentPage: page,
    };
  }

  async getOfferById(user: User, id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id, provider: { id: user.id } },
      relations: ['userSkill.skill.category'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async deleteOffer(user: User, id: number) {
    return this.offerRepository.delete({ id, provider: { id: user.id } });
  }

  async deleteMany(findOptionsWhere: FindOptionsWhere<Offer>) {
    return this.offerRepository.delete(findOptionsWhere);
  }
}
