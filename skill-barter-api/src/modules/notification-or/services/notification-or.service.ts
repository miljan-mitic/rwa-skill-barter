import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationOR } from 'src/entities/notification-or.entity';
import { Repository } from 'typeorm';
import { CreateNotificationOR } from '../interfaces/notification-or.interface';
import { User } from 'src/entities/user.entity';
import { OfferRequestService } from 'src/modules/offer-request/services/offer-request.service';
import { FilterNotificationORDto } from '../dtos/filter-notification-or.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';
import { NotificationSocketGateway } from 'src/modules/socket/gateways/notification-socket.gateway';
import { SOCKET_EVENT_TYPE } from 'src/common/enums/socket-event-type.enum';
import { SeenNotificationsOR } from '../dtos/seen-notifications-or.dto';

@Injectable()
export class NotificationORService {
  constructor(
    @InjectRepository(NotificationOR)
    private readonly notificationORRepository: Repository<NotificationOR>,
    @Inject(forwardRef(() => OfferRequestService))
    private readonly offerRequestService: OfferRequestService,
    private readonly notificationSocketGateway: NotificationSocketGateway,
  ) {}

  async create(user: User, createNotificationOR: CreateNotificationOR) {
    const { offerRequestId, ...createNotificationORData } =
      createNotificationOR;

    const offerRequest = await this.offerRequestService.findById(
      offerRequestId,
      {
        offer: { userSkill: { user: true } },
        userSkill: { user: true, skill: true },
      },
    );

    if (offerRequest.offer.userSkill.user.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const newNotificationOR = this.notificationORRepository.create({
      ...createNotificationORData,
      offerRequest,
    });

    try {
      await this.notificationORRepository.save(newNotificationOR);
    } catch (error) {
      console.warn('NOTIFICATION OR SERVICE - CREATE NOTIFICATION OR:', error);
      throw new InternalServerErrorException('Unexpected error');
    }

    const sendTo = offerRequest.userSkill.user.id.toString();
    this.notificationSocketGateway.sendNotification(
      sendTo,
      SOCKET_EVENT_TYPE.NOTIFICATIONS_OR,
      newNotificationOR,
    );

    return newNotificationOR;
  }

  async getNotificationsOR(
    user: User,
    filterNotificationORDto: FilterNotificationORDto,
  ) {
    const {
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterNotificationORDto;

    const filters: Record<string, any> = {
      userId: user.id,
    };

    const queryBuilder = this.notificationORRepository
      .createQueryBuilder('notificationOR')
      .leftJoinAndSelect('notificationOR.offerRequest', 'offerRequest')
      .leftJoinAndSelect('offerRequest.userSkill', 'userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('userSkill.user', 'userSender')
      .leftJoinAndSelect('offerRequest.offer', 'offer')
      .leftJoinAndSelect('offer.userSkill', 'userSkillCreator')
      .leftJoinAndSelect('userSkillCreator.user', 'userCreator')
      .where('userSender.id = :userId', filters);

    queryBuilder.addOrderBy(`notificationOR.${sortBy}`, sortType);

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

  async getNumberUnseen(user: User) {
    const numberUnseen = await this.notificationORRepository.count({
      where: {
        seen: false,
        offerRequest: {
          userSkill: {
            user: {
              id: user.id,
            },
          },
        },
      },
    });

    return {
      numberUnseen,
    };
  }

  async markAsSeens(user: User, seenNotificationsOR: SeenNotificationsOR) {
    const { ids, markAll } = seenNotificationsOR;

    const queryBuilder = this.notificationORRepository
      .createQueryBuilder('notification_or')
      .update()
      .set({ seen: true })
      .where('notification_or.seen = false')
      .andWhere(
        `
    offerRequestId IN (
      SELECT offerReq.id
      FROM offer_request  offerReq
      INNER JOIN user_skill us ON us.id = offerReq."userSkillId"
      WHERE us."userId" = :userId
    )
  `,
      )
      .setParameter('userId', user.id)
      .returning(['id', 'seen']);

    if (!markAll) {
      queryBuilder.andWhere('id IN (:...ids)', { ids });
    }

    const result = await queryBuilder.execute();

    if (!result.affected) {
      throw new BadRequestException('Invalid ids:', ids.join(', '));
    }

    const updatedNotificationsOR = this.notificationORRepository.create(
      result.raw,
    );

    return updatedNotificationsOR;
  }
}
