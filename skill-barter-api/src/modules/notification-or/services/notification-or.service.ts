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
import { SortType } from 'src/common/enums/sort.enum';
import { NotificationSocketGateway } from 'src/modules/socket/gateways/notification-socket.gateway';
import { SOCKET_EVENT_TYPE } from 'src/common/enums/socket-event-type.enum';
import { SeenNotificationsOR } from '../dtos/seen-notifications-or.dto';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class NotificationORService {
  constructor(
    @InjectRepository(NotificationOR)
    private readonly notificationORRepository: Repository<NotificationOR>,
    @Inject(forwardRef(() => OfferRequestService))
    private readonly offerRequestService: OfferRequestService,
    private readonly notificationSocketGateway: NotificationSocketGateway,
    private readonly userService: UserService,
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

    const userIds = [
      offerRequest.offer.userSkill.user.id,
      offerRequest.userSkill.user.id,
    ];

    if (!userIds.includes(user.id)) {
      throw new ForbiddenException('Access denied');
    }

    const sendTo = userIds.filter((userId) => userId !== user.id)[0];
    const receiver = await this.userService.getUserById(sendTo);

    const newNotificationOR = this.notificationORRepository.create({
      ...createNotificationORData,
      offerRequest,
      receiver,
    });

    try {
      await this.notificationORRepository.save(newNotificationOR);
    } catch (error) {
      console.warn('NOTIFICATION OR SERVICE - CREATE NOTIFICATION OR:', error);
      throw new InternalServerErrorException('Unexpected error');
    }

    this.notificationSocketGateway.sendNotification(
      sendTo.toString(),
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
      sortBy = 'createdAt',
      sortType = SortType.ASC,
    } = filterNotificationORDto;

    const filters: Record<string, any> = {
      userId: user.id,
    };

    const queryBuilder = this.notificationORRepository
      .createQueryBuilder('notificationOR')
      .leftJoin('notificationOR.receiver', 'receiver')
      .leftJoinAndSelect('notificationOR.offerRequest', 'offerRequest')
      .leftJoinAndSelect('offerRequest.userSkill', 'userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('userSkill.user', 'userSender')
      .leftJoinAndSelect('offerRequest.offer', 'offer')
      .leftJoinAndSelect('offer.userSkill', 'userSkillCreator')
      .leftJoinAndSelect('userSkillCreator.user', 'userCreator')
      .where('receiver.id = :userId', filters);

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
        receiver: {
          id: user.id,
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
      .createQueryBuilder()
      .update()
      .set({ seen: true })
      .where('seen = false')
      .andWhere('receiverId = :userId', { userId: user.id })
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
