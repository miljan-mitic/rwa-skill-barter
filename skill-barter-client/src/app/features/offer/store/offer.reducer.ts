import { createEntityAdapter } from '@ngrx/entity';
import { Offer } from '../../../common/models/offer.model';
import { OfferFilter, OfferState } from './offer.state';
import { createReducer, on } from '@ngrx/store';
import { OfferActions } from './offer.actions';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortBy, SortType } from '../../../common/enums/sort.enum';
import { OfferStatus } from '../../../common/enums/offer-status.enum';

const adapter = createEntityAdapter<Offer>();

export const initialStateOfferFilter: OfferFilter = {
  global: true,
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.OFFER.PAGE_SIZE,
  sortBy: SortBy.CREATED_AT,
  sortType: SortType.DESC,
  userOffers: false,
  status: OfferStatus.ACTIVE,
  skillId: undefined,
  categoryId: undefined,
  meetingType: undefined,
};

export const initialState: OfferState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateOfferFilter,
});

export const offerReducer = createReducer(
  initialState,
  on(OfferActions.loadOffers, OfferActions.loadOffer, (state: OfferState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(OfferActions.changeOfferFilter, (state: OfferState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
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
