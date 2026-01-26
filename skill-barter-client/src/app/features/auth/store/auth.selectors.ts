import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthFeature = createFeatureSelector<AuthState>('auth');

export const selectAuthStatus = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.status,
);

export const selectToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.accessToken,
);
