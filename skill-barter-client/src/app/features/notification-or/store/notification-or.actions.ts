import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { NotificationORFilterDto } from '../dtos/notification-or-filter.dto';
import { NotificationOR } from '../../../common/models/notification-or.model';
import { NotificationORFilter, UpdateNotificationOR } from './notification-or.state';
import { NotificationsSeenDto } from '../dtos/notifications-or-seen.dto';

export const NotificationORActions = createActionGroup({
  source: 'NotificationOR',
  events: {
    'Load notifications o r': props<{
      notificationORFilterDto: NotificationORFilterDto;
      isAdmin?: boolean;
    }>(),
    'Load notifications o r success': props<{
      notificationsOR: NotificationOR[];
      length: number;
    }>(),
    'Load notifications o r failure': props<{ error: any }>(),

    'Change notification o r filter': props<{ filter: NotificationORFilter }>(),

    'Load number unseen notifications o r': emptyProps(),
    'Load number unseen notifications o r success': props<{ numberUnseen: number }>(),
    'Load number unseen notifications o r failure': props<{ error: any }>(),

    'Notification o r received': props<{ notificationOR: NotificationOR }>(),

    'Seen notifications o r': props<{ notificationsSeenDto: NotificationsSeenDto }>(),
    'Seen notifications o r success': props<{ updatedNotificationsOR: UpdateNotificationOR[] }>(),
    'Seen notifications o r failure': props<{ error: any }>(),
  },
});
