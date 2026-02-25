import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { OfferRequestActions } from './offer-request.actions';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortBy, SortType } from '../../../common/enums/sort.enum';
import { OfferRequest } from '../../../common/models/offer-request.model';
import { OfferRequestFilter, OfferRequestState } from './offer-request.state';

const adapter = createEntityAdapter<OfferRequest>();

export const initialStateOfferRequestFilter: OfferRequestFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.DEFAULT.PAGE_SIZE,
  sortBy: SortBy.CREATED_AT,
  sortType: SortType.DESC,
  offerId: undefined,
  skillId: undefined,
  status: undefined,
};

export const initialState: OfferRequestState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateOfferRequestFilter,
});

export const offerRequestReducer = createReducer(
  initialState,
  on(OfferRequestActions.loadOfferRequests, (state: OfferRequestState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(OfferRequestActions.changeOfferRequestFilter, (state: OfferRequestState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    };
  }),
  on(
    OfferRequestActions.loadOfferRequestsSuccess,
    (state: OfferRequestState, { offerRequests, length }) => {
      return adapter.setAll(offerRequests, {
        ...state,
        length,
        loading: false,
      });
    },
  ),
  on(OfferRequestActions.loadOfferRequestsFailure, (state: OfferRequestState) => {
    return {
      ...state,
      loading: false,
    };
  }),
);
