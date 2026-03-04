import { OfferMeetingType } from '../../../common/enums/offer-meeting-type.enum';
import { OfferStatus } from '../../../common/enums/offer-status.enum';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { Offer } from '../../../common/models/offer.model';

export interface OfferFilterDto extends PaginationParams<Offer> {
  userOffers?: boolean;
  skillId?: number;
  categoryId?: number;
  status?: OfferStatus;
  meetingType?: OfferMeetingType;
  // minBarterCredit?: number;
  // maxBarterCredit?: number;
}
