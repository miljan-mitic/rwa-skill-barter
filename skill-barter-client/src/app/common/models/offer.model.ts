import { OfferMeetingType } from '../enums/offer-meeting-type.enum';
import { OfferStatus } from '../enums/offer-status.enum';
import { UserSkill } from './user-skill.model';
import { User } from './user.model';

export interface Offer {
  id: number;
  title: string;
  description?: string;
  barterCredits: number;
  meetingType: OfferMeetingType;
  status: OfferStatus;
  createdAt: Date;
  provider?: User;
  userSkill?: UserSkill;
  // offerRequests?: OfferRequest[];
  // transactions?: Transaction[];
}
