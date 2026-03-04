import { BarterUserRole } from '../enums/barter-user-role.enum';
import { MeetingState } from '../types/meeting-state.type';
import { OfferRequest } from './offer-request.model';

export interface Barter {
  id: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  offerRequest?: OfferRequest;
  userRole: BarterUserRole;
  meetingState: MeetingState;
}
