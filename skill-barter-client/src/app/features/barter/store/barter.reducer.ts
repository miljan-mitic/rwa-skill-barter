import { createEntityAdapter } from '@ngrx/entity';
import { Barter } from '../../../common/models/barter.model';
import { BarterFilter, BarterState } from './barter.state';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortType } from '../../../common/enums/sort.enum';
import { createReducer, on } from '@ngrx/store';
import { BarterActions } from './barter.actions';

const adapter = createEntityAdapter<Barter>();

export const initialStateBarterFilter: BarterFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.DEFAULT.PAGE_SIZE,
  sortBy: 'startTime',
  sortType: SortType.ASC,
};

export const initialState: BarterState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateBarterFilter,
});

export const barterReducer = createReducer(
  initialState,
  on(BarterActions.loadBarters, (state: BarterState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(BarterActions.restartBarterFilter, (state: BarterState) => {
    return { ...state, filter: initialStateBarterFilter };
  }),
  on(BarterActions.changeBarterFilter, (state: BarterState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    };
  }),
  on(BarterActions.loadBartersSuccess, (state: BarterState, { barters, length }) => {
    return adapter.setAll(barters, {
      ...state,
      length,
      loading: false,
    });
  }),
  on(BarterActions.loadBartersFailure, (state: BarterState) => {
    return {
      ...state,
      loading: false,
    };
  }),
  on(BarterActions.loadMeetingsStatesSuccess, (state: BarterState, { updateBarters }) => {
    return adapter.updateMany(updateBarters, { ...state });
  }),
);
