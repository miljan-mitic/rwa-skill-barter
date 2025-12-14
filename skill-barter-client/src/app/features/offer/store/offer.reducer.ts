import { createEntityAdapter } from '@ngrx/entity';
import { Offer } from '../../../common/models/offer.model';
import { OfferState } from './offer.state';
import { createReducer, on } from '@ngrx/store';
import { OfferActions } from './offer.actions';

const adapter = createEntityAdapter<Offer>();

export const initialState: OfferState = adapter.getInitialState({
  length: 0,
  filter: {},
});

export const offerReducer = createReducer(
  initialState,
  on(OfferActions.changeOfferPaginationFilter, (state: OfferState, { paginationParams }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...paginationParams,
      },
    };
  }),
  on(OfferActions.loadOffersSuccess, (state: OfferState, { offers, length }) => {
    return adapter.setAll(offers, {
      ...state,
      length,
    });
  })
);
