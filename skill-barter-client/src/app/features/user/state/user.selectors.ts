import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserFilter, UserState } from './user.state';
import { User } from '../../../common/models/user.model';

export const selectUserFeature = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserFeature,
  (state: UserState) => state.currentUser,
);

export const selectUserList = createSelector(selectUserFeature, (state: UserState) =>
  state.ids.reduce((acc: User[], id: string | number) => {
    const user = state.entities[id];
    if (user) {
      acc.push(user);
    }
    return acc;
  }, []),
);

export const selectUserLength = createSelector(
  selectUserFeature,
  (state: UserState) => state.length,
);

export const selectUserLoading = createSelector(
  selectUserFeature,
  (state: UserState) => state.loading,
);

export const selectUserFilter = createSelector(
  selectUserFeature,
  (state: UserState) => state.filter,
);

export const selectUserPaginationParams = createSelector(selectUserFilter, (state: UserFilter) => ({
  page: state.page,
  pageSize: state.pageSize,
}));
