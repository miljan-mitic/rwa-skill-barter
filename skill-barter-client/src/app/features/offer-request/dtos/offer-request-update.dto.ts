import { OfferRequestStatus } from '../../../common/enums/offer-request-status.enum';

export interface OfferRequestUpdateDto {
  status?: OfferRequestStatus;
}
