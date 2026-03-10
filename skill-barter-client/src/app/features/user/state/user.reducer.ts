import { createReducer, on } from '@ngrx/store';
import { UserFilter, UserState } from './user.state';
import { AuthActions } from '../../auth/store/auth.actions';
import { UserActions } from './user.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { User } from '../../../common/models/user.model';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortType } from '../../../common/enums/sort.enum';

const adapter = createEntityAdapter<User>();

const initialStateFilter: UserFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.DEFAULT.PAGE_SIZE,
  sortBy: 'createdAt',
  sortType: SortType.DESC,
};

export const initialState: UserState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateFilter,
});
export const userReducer = createReducer(
  initialState,
  on(
    AuthActions.loginSuccess,
    AuthActions.signupSuccess,
    AuthActions.autoLoginSuccess,
    (state, { user }) => ({
      ...state,
      currentUser: user,
    }),
  ),
  on(UserActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    currentUser: undefined,
  })),
  on(UserActions.loadUsers, (state: UserState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(UserActions.restartUserFilter, AuthActions.logout, (state: UserState) => {
    return { ...state, filter: initialStateFilter };
  }),
  on(UserActions.changeUserFilter, (state: UserState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    };
  }),
  on(UserActions.loadUsersSuccess, (state: UserState, { users, length }) => {
    return adapter.setAll(users, {
      ...state,
      length,
      loading: false,
    });
  }),
  on(UserActions.loadUsersFailure, (state: UserState) => {
    return {
      ...state,
      loading: false,
    };
  }),
);
