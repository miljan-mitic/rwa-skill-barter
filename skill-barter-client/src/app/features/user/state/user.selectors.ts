import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserFeature = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserFeature,
  (state: UserState) => state.currentUser
);
