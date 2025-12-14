import { OFFER_STATUS } from '../enums/offer-status.enum';
import { Skill } from './skill.model';
import { User } from './user.model';

export interface Offer {
  id: number;
  title: string;
  description?: string;
  barterCredits: number;
  availability: string;
  status: OFFER_STATUS;
  createdAt: Date;
  provider?: User;
  skill?: Skill;
  // offerRequests?: OfferRequest[];
  // transactions?: Transaction[];
}
