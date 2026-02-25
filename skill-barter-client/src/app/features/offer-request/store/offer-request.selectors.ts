import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OfferRequestFilter, OfferRequestState } from './offer-request.state';
import { OfferRequest } from '../../../common/models/offer-request.model';

export const selectOfferRequestFeature = createFeatureSelector<OfferRequestState>('offerRequest');

export const selectOfferRequestList = createSelector(
  selectOfferRequestFeature,
  (state: OfferRequestState) =>
    state.ids.reduce((acc: OfferRequest[], id: number | string) => {
      const offerRequest = state.entities[id];
      if (offerRequest) {
        acc.push(offerRequest);
      }
      return acc;
    }, []),
);

export const selectOfferRequestLength = createSelector(
  selectOfferRequestFeature,
  (state: OfferRequestState) => state.length,
);

export const selectOfferRequestFilter = createSelector(
  selectOfferRequestFeature,
  (state: OfferRequestState) => state.filter,
);

export const selectOfferRequestLoading = createSelector(
  selectOfferRequestFeature,
  (state: OfferRequestState) => state.loading,
);

export const selectOfferRequestPaginationParamas = createSelector(
  selectOfferRequestFilter,
  (state: OfferRequestFilter) => ({ page: state.page, pageSize: state.pageSize }),
);
