import { createEntityAdapter } from '@ngrx/entity';
import { Offer } from '../../../common/models/offer.model';
import { OfferFilter, OfferState } from './offer.state';
import { createReducer, on } from '@ngrx/store';
import { OfferActions } from './offer.actions';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortBy, SortType } from '../../../common/enums/sort.enum';

const adapter = createEntityAdapter<Offer>();

const initialStateFilter: OfferFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.OFFER.PAGE_SIZE,
  sortBy: SortBy.CREATED_AT,
  sortType: SortType.DESC,
};

export const initialState: OfferState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateFilter,
});

export const offerReducer = createReducer(
  initialState,
  on(OfferActions.loadOffers, OfferActions.loadOffer, (state: OfferState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(OfferActions.restartOfferFilter, (state: OfferState) => {
    return {
      ...state,
      filter: initialStateFilter,
    };
  }),
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
      loading: false,
    });
  }),
  on(
    OfferActions.loadOfferSuccess,
    OfferActions.updateOfferSuccess,
    (state: OfferState, { offer }) => {
      return {
        ...state,
        detailedOffer: offer,
        loading: false,
      };
    },
  ),
  on(OfferActions.loadOffersFailure, OfferActions.loadOfferFailure, (state: OfferState) => {
    return {
      ...state,
      loading: false,
    };
  }),
);
