import { OfferRequestStatus } from '../enums/offer-request-status.enum';
import { Offer } from './offer.model';
import { UserSkill } from './user-skill.model';

export interface OfferRequest {
  id: number;
  message?: string;
  status: OfferRequestStatus;
  statusOrder: number;
  createdAt: Date;
  userSkill?: UserSkill;
  offer?: Offer;
}
