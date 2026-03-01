import { NotificationORType } from '../enums/notification-or-type.enum';

export const NOTIFICATION_OR_TYPE_ICON = {
  [NotificationORType.OFFER_REQUEST_ACCEPTED]: 'check_circle',
  [NotificationORType.OFFER_REQUEST_REJECTED]: 'close',
  [NotificationORType.OFFER_REQUEST_CANCELED]: 'do_disturb',
};

export const NOTIFICATION_OR_TYPE_ICON_CLASSES = {
  [NotificationORType.OFFER_REQUEST_ACCEPTED]: 'type-accepted',
  [NotificationORType.OFFER_REQUEST_REJECTED]: 'type-rejected',
  [NotificationORType.OFFER_REQUEST_CANCELED]: 'type-canceled',
};
