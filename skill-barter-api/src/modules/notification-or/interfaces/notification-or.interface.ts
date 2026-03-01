import { NOTIFICATION_OR_TYPE } from 'src/common/enums/notification-or-type.enum';

export interface CreateNotificationOR {
  type: NOTIFICATION_OR_TYPE;
  offerRequestId: number;
}
