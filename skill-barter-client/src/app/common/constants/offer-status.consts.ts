import { OfferStatus } from '../enums/offer-status.enum';

export const OFFER_STATUS_CLASSES = {
  [OfferStatus.ACTIVE]: 'status-active',
  [OfferStatus.PAUSED]: 'status-paused',
  [OfferStatus.ARCHIVED]: 'status-archived',
};

export const OFFER_STATUS_BUTTON_CLASSES = {
  [OfferStatus.ACTIVE]: 'status-button-active',
  [OfferStatus.PAUSED]: 'status-button-paused',
};

export const OFFER_CHANGE_STATUS = {
  [OfferStatus.ACTIVE]: OfferStatus.PAUSED,
  [OfferStatus.PAUSED]: OfferStatus.ACTIVE,
  [OfferStatus.ARCHIVED]: OfferStatus.ARCHIVED,
};
