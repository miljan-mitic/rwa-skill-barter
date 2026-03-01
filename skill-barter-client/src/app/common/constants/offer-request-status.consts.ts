import { OfferRequestStatus } from '../enums/offer-request-status.enum';

export const OFFER_REQUEST_STATUS_CLASSES = {
  [OfferRequestStatus.PENDING]: 'status-pending',
  [OfferRequestStatus.ACCEPTED]: 'status-accepted',
  [OfferRequestStatus.REJECTED]: 'status-rejected',
};

export const OFFER_REQUEST_STATUS_ICON = {
  [OfferRequestStatus.PENDING]: 'pending',
  [OfferRequestStatus.ACCEPTED]: 'check_circle',
  [OfferRequestStatus.REJECTED]: 'close',
};

export const OFFER_REQUESTS_SECTION = 'offer-requests-section';
