import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferRequest } from 'src/entities/offer-request.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateOfferRequestDto } from '../dtos/create-offer-request.dto';
import { User } from 'src/entities/user.entity';
import { UserSkillService } from 'src/modules/user-skill/services/user-skill.service';
import { OfferService } from 'src/modules/offer/services/offer.service';
import { FilterOfferRequestDto } from '../dtos/filter-offer-request.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';
import { UpdateOfferRequestDto } from '../dtos/update-offer-request.dto';
import { OFFER_REQUEST_STATUS } from 'src/common/enums/offer-request-status.enum';
import { removeUndefinedAttributes } from 'src/common/utils/remove-undefined-attributes';
import { NotificationORService } from 'src/modules/notification-or/services/notification-or.service';
import { NOTIFICATION_OR_TYPE } from 'src/common/enums/notification-or-type.enum';
import { NOTIFICATION_OR_TYPE_MAPPING } from 'src/common/constants/notification-or-type-mapping.const';

@Injectable()
export class OfferRequestService {
  constructor(
    @InjectRepository(OfferRequest)
    private readonly offerRequestRepository: Repository<OfferRequest>,
    private readonly userSkillService: UserSkillService,
    private readonly offerService: OfferService,
    private readonly notificationORService: NotificationORService,
  ) {}

  async create(user: User, createOfferRequestDto: CreateOfferRequestDto) {
    const { userSkillId, offerId, ...createOfferRequestData } =
      createOfferRequestDto;

    const userSkill = await this.userSkillService.findById(userSkillId, {
      user: true,
    });

    if (userSkill.user.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new BadRequestException('Invalid offer');
    }

    const newOfferRequest = this.offerRequestRepository.create({
      ...createOfferRequestData,
      userSkill,
      offer,
    });

    try {
      await this.offerRequestRepository.save(newOfferRequest);
    } catch (error) {
      console.warn('OFFER REQUEST SERVICE - CREATE OFFER REQUEST:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
    return newOfferRequest;
  }

  async findById(id: number, relations?: FindOptionsRelations<OfferRequest>) {
    const offer = await this.offerRequestRepository.findOne({
      where: { id },
      relations,
    });
    if (!offer) {
      throw new NotFoundException(`Offer request with ID ${id} not found`);
    }
    return offer;
  }

  async updateOfferRequest(
    user: User,
    id: number,
    updateOfferRequestDto: UpdateOfferRequestDto,
  ) {
    const offerRequest = await this.offerRequestRepository.findOne({
      where: { id, offer: { userSkill: { user: { id: user.id } } } },
      relations: { offer: true },
    });

    if (!offerRequest) {
      throw new NotFoundException('Offer request not found');
    }

    if (offerRequest.status === OFFER_REQUEST_STATUS.REJECTED) {
      throw new BadRequestException('Rejected offer request cannot be updated');
    }

    const { status } = updateOfferRequestDto;

    const notAllowedChangeStatus =
      status &&
      offerRequest.status === OFFER_REQUEST_STATUS.ACCEPTED &&
      status === OFFER_REQUEST_STATUS.PENDING;

    if (notAllowedChangeStatus) {
      throw new BadRequestException(
        'Offer request cannot be returned from active state to pending state',
      );
    }

    const oldStatus = offerRequest.status;
    const filteredDto = removeUndefinedAttributes(updateOfferRequestDto);
    Object.assign(offerRequest, filteredDto);

    try {
      await this.offerRequestRepository.save(offerRequest);
    } catch (error) {
      console.warn('OFFER REQUEST SERVICE - UPDATE OFFER REQUEST:', error);
      throw new InternalServerErrorException('Unexpected error');
    }

    if (status) {
      const canceled =
        oldStatus === OFFER_REQUEST_STATUS.ACCEPTED &&
        status === OFFER_REQUEST_STATUS.REJECTED;

      await this.notificationORService.create(user, {
        offerRequestId: offerRequest.id,
        type: canceled
          ? NOTIFICATION_OR_TYPE.OFFER_REQUEST_CACELED
          : NOTIFICATION_OR_TYPE_MAPPING[status],
      });
    }

    return offerRequest;
  }

  async getOfferRequests(
    user: User,
    filterOfferRequestDto: FilterOfferRequestDto,
  ) {
    const {
      skillId,
      offerId,
      status,
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterOfferRequestDto;

    const filters: Record<string, any> = {
      userId: user.id,
    };

    const queryBuilder = this.offerRequestRepository
      .createQueryBuilder('offerRequest')
      .leftJoin('offerRequest.offer', 'offer')
      .leftJoin('offer.userSkill', 'userSkillCreator')
      .leftJoin('userSkillCreator.user', 'userCreator')
      .leftJoinAndSelect('offerRequest.userSkill', 'userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('userSkill.user', 'user')
      .where('userCreator.id = :userId', filters);

    if (skillId) {
      queryBuilder.andWhere('skill.id = :skillId');
      filters.skillId = skillId;
    }

    if (offerId) {
      queryBuilder.andWhere('offer.id = :offerId');
      filters.offerId = offerId;
    }

    if (status) {
      queryBuilder.andWhere('offerRequest.status = :status');
      filters.status = status;
    }

    queryBuilder.setParameters(filters);

    queryBuilder
      .orderBy('offerRequest.statusOrder', SortType.ASC)
      .addOrderBy(`offerRequest.${sortBy}`, sortType);

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
}
