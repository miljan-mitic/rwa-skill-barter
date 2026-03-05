import { BarterUserRole } from '../enums/barter-user-role.enum';
import { MeetingState } from '../types/meeting-state.type';
import { OfferRequest } from './offer-request.model';
import { Review } from './review.model';

export interface Barter {
  id: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  offerRequest?: OfferRequest;
  reviews?: Review[];
  userRole: BarterUserRole;
  isHasReview: boolean;
  meetingState: MeetingState;
}
