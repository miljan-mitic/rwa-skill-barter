import { OfferMeetingType } from '../../../common/enums/offer-meeting-type.enum';
import { OfferStatus } from '../../../common/enums/offer-status.enum';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';

export interface OfferFilterDto extends PaginationParams {
  userOffers?: boolean;
  skillId?: number;
  categoryId?: number;
  status?: OfferStatus;
  meetingType?: OfferMeetingType;
  // minBarterCredit?: number;
  // maxBarterCredit?: number;
}
