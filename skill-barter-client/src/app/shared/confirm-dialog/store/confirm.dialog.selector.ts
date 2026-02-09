import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfirmDialogState } from './confirm-dialog.state';

export const selectConfirmDialogFeature =
  createFeatureSelector<ConfirmDialogState>('confirmDialog');

export const selectConfirmDialog = createSelector(
  selectConfirmDialogFeature,
  (state: ConfirmDialogState) => state,
);
