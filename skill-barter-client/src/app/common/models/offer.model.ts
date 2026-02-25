import { OfferMeetingType } from '../enums/offer-meeting-type.enum';
import { OfferStatus } from '../enums/offer-status.enum';
import { Barter } from './barter.model';
import { OfferRequest } from './offer-request.model';
import { UserSkill } from './user-skill.model';

export interface Offer {
  id: number;
  title: string;
  description?: string;
  // barterCredits: number;
  meetingType: OfferMeetingType;
  status: OfferStatus;
  meetingAt: Date;
  durationMinutes: number;
  createdAt: Date;
  userSkill?: UserSkill;
  offerRequests?: OfferRequest[];
  barters: Barter;
  hasCurrentUserRequest?: boolean;
  hasAcceptedRequest?: boolean;
}
