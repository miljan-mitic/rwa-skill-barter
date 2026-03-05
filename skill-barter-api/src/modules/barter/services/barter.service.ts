import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barter } from 'src/entities/barter.entity';
import { User } from 'src/entities/user.entity';
import { Brackets, FindOptionsRelations, In, Repository } from 'typeorm';
import { CreateBarterDto } from '../dtos/create-barter.dto';
import { OfferRequestService } from 'src/modules/offer-request/services/offer-request.service';
import { SortType } from 'src/common/enums/sort.enum';
import { FilterBarterDto } from '../dtos/filter-barter.dto';
import { BARTER_USER_ROLE } from 'src/common/enums/barter-user-role.enum';
import { MeetingState } from 'src/common/types/meeting-state.type';
import { MEETING_STATE_STATUS } from 'src/common/enums/meeting-state-status.enum';
import { BarterMeetingState } from 'src/common/interfaces/barter-meeting-state.interface';

@Injectable()
export class BarterService {
  constructor(
    @InjectRepository(Barter)
    private readonly barterRepository: Repository<Barter>,
    @Inject(forwardRef(() => OfferRequestService))
    private readonly offerRequestService: OfferRequestService,
  ) {}

  async create(createBarterDto: CreateBarterDto) {
    const { offerRequestId, ...createBarterData } = createBarterDto;

    const offerRequest = await this.offerRequestService.findById(
      offerRequestId,
      {
        barter: true,
        offer: { userSkill: { skill: true, user: true } },
        userSkill: { skill: true, user: true },
      },
    );

    if (offerRequest.barter) {
      throw new BadRequestException('Barter already exists!');
    }

    const newBarter = this.barterRepository.create({
      ...createBarterData,
      offerRequest,
    });

    try {
      await this.barterRepository.save(newBarter);
    } catch (error) {
      console.warn('BARTER SERVICE - CREATE BARTER:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
    return newBarter;
  }

  async findById(id: number, relations?: FindOptionsRelations<Barter>) {
    const barter = await this.barterRepository.findOne({
      where: { id },
      relations,
    });
    if (!barter) {
      throw new NotFoundException(`Barter with ID ${id} not found`);
    }
    return barter;
  }

  async getBarters(user: User, filterBarterDto: FilterBarterDto) {
    const {
      barterUserRole,
      page = 0,
      pageSize = 10,
      sortBy = 'createdAt',
      sortType = SortType.ASC,
    } = filterBarterDto;

    const queryBuilder = this.barterRepository
      .createQueryBuilder('barter')
      .leftJoinAndSelect('barter.offerRequest', 'offerRequest')
      .leftJoinAndSelect('offerRequest.userSkill', 'userSkillApplicant')
      .leftJoinAndSelect('userSkillApplicant.skill', 'skillApplicant')
      .leftJoinAndSelect('userSkillApplicant.user', 'userApplicant')
      .leftJoinAndSelect('offerRequest.offer', 'offer')
      .leftJoinAndSelect('offer.userSkill', 'userSkillPublisher')
      .leftJoinAndSelect('userSkillPublisher.skill', 'skillPublisher')
      .leftJoinAndSelect('userSkillPublisher.user', 'userPublisher')
      .addSelect(
        `
          CASE
            WHEN userApplicant.id = :userId THEN '${BARTER_USER_ROLE.APPLICANT}'
            WHEN userPublisher.id = :userId THEN '${BARTER_USER_ROLE.PUBLISHER}'
          END
        `,
        'userRole',
      )
      .addSelect(
        `
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM review r
            WHERE r."barterId" = barter.id
            AND r."reviewerId" = :userId
          )
          THEN true
          ELSE false
        END
        `,
        'isHasReview',
      )
      .where(
        new Brackets((qb) => {
          qb.where('userApplicant.id = :userId').orWhere(
            'userPublisher.id = :userId',
          );
        }),
      );

    if (barterUserRole === BARTER_USER_ROLE.APPLICANT) {
      queryBuilder.where('userApplicant.id = :userId');
    }

    if (barterUserRole === BARTER_USER_ROLE.PUBLISHER) {
      queryBuilder.where('userPublisher.id = :userId');
    }

    queryBuilder.setParameter('userId', user.id);

    console.log({ sortBy, sortType });
    queryBuilder.orderBy(`barter.${sortBy}`, sortType);

    queryBuilder.skip(page * pageSize).take(pageSize);

    const [count, rawAndEntities] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getRawAndEntities(),
    ]);

    const items = rawAndEntities.entities?.map((barter, index) => ({
      ...barter,
      userRole: rawAndEntities?.raw[index]?.userRole,
      isHasReview: rawAndEntities?.raw[index]?.isHasReview,
      meetingState: this.calculateMeetingState(barter),
    }));

    return {
      items,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
      currentPage: page,
    };
  }

  async getBartersMeetingsStates(
    barterIds: number[],
  ): Promise<BarterMeetingState[]> {
    const barters = await this.barterRepository.find({
      where: { id: In(barterIds) },
    });

    const bartersMeetingsStates: BarterMeetingState[] = barters.map(
      (barter) => ({
        ...barter,
        meetingState: this.calculateMeetingState(barter),
      }),
    );

    return bartersMeetingsStates;
  }

  calculateMeetingState(barter: Barter): MeetingState {
    const { startTime, endTime } = barter;

    if (!startTime || !endTime) return;

    const now = Date.now();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) {
      return {
        status: MEETING_STATE_STATUS.UPCOMING,
        secondsToStart: Math.floor((start - now) / 1000),
      };
    }

    if (now >= start && now <= end) {
      return {
        status: MEETING_STATE_STATUS.IN_PROGRESS,
        secondsToExpired: Math.floor((end - now) / 1000),
      };
    }

    return {
      status: MEETING_STATE_STATUS.EXPIRED,
    };
  }

  async deleteById(id: number) {
    const deleteResult = await this.barterRepository.delete({ id });

    return !!deleteResult.affected;
  }
}
