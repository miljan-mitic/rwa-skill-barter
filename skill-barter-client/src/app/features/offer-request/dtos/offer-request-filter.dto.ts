import { OfferRequestStatus } from '../../../common/enums/offer-request-status.enum';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';

export interface OfferRequestFilterDto extends PaginationParams {
  offerId?: number;
  skillId?: number;
  status?: OfferRequestStatus;
}
