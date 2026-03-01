import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { NotificationORService } from '../services/notification-or.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { FilterNotificationORDto } from '../dtos/filter-notification-or.dto';
import { SeenNotificationsOR } from '../dtos/seen-notifications-or.dto';

@Controller('notifications-or')
export class NotificationORController {
  constructor(private readonly notifactionORService: NotificationORService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getNotificationsOR(
    @UserDecorator() user: User,
    @Query() filterNotificationORDto: FilterNotificationORDto,
  ) {
    return this.notifactionORService.getNotificationsOR(
      user,
      filterNotificationORDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('number-unseen')
  getNumberUnseen(@UserDecorator() user: User) {
    return this.notifactionORService.getNumberUnseen(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('seen')
  markAsSeens(
    @UserDecorator() user: User,
    @Body() seenNotificationsOR: SeenNotificationsOR,
  ) {
    return this.notifactionORService.markAsSeens(user, seenNotificationsOR);
  }
}
