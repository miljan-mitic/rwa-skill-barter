import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthFeature = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.isAuthenticated
);

export const selectToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.accessToken
);
