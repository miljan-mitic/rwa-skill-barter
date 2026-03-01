import { NotificationORType } from '../enums/notification-or-type.enum';
import { OfferRequest } from './offer-request.model';

export interface NotificationOR {
  id: number;
  type: NotificationORType;
  // message: string;
  seen: boolean;
  createdAt: Date;
  offerRequest?: OfferRequest;
}
