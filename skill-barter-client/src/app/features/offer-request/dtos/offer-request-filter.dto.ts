import { OfferRequestStatus } from '../../../common/enums/offer-request-status.enum';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { OfferRequest } from '../../../common/models/offer-request.model';

export interface OfferRequestFilterDto extends PaginationParams<OfferRequest> {
  offerId?: number;
  skillId?: number;
  status?: OfferRequestStatus;
}
