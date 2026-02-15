import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OfferState } from './offer.state';
import { Offer } from '../../../common/models/offer.model';

export const selectOfferFeature = createFeatureSelector<OfferState>('offer');

export const selectOfferList = createSelector(selectOfferFeature, (state: OfferState) =>
  state.ids.reduce((acc: Offer[], id: number | string) => {
    const offer = state.entities[id];
    if (offer) {
      acc.push(offer);
    }
    return acc;
  }, []),
);

export const selectOfferLength = createSelector(
  selectOfferFeature,
  (state: OfferState) => state.length,
);

export const selectOfferFilter = createSelector(
  selectOfferFeature,
  (state: OfferState) => state.filter,
);

export const selectOfferLoading = createSelector(
  selectOfferFeature,
  (state: OfferState) => state.loading,
);

export const selectOfferDetailed = createSelector(
  selectOfferFeature,
  (state: OfferState) => state.detailedOffer,
);
