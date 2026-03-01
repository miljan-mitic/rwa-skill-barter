import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SocketState } from './socket.state';

export const selectSocketFeature = createFeatureSelector<SocketState>('socket');

export const selectSocketInitialzed = createSelector(
  selectSocketFeature,
  (state: SocketState) => state.initialized,
);
