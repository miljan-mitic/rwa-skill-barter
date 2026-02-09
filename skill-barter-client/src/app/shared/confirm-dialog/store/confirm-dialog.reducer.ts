import { createReducer, on } from '@ngrx/store';
import { ConfirmDialogState } from './confirm-dialog.state';
import { ConfirmDialogActions } from './confirm-dialog.actions';

export const initialConfirmDialogState: ConfirmDialogState = {
  isOpen: false,
  title: null,
  message: null,
  confirmAction: null,
};

export const confirmDialogReducer = createReducer(
  initialConfirmDialogState,

  on(ConfirmDialogActions.openConfirmDialog, (state, { message, title, confirmAction }) => ({
    ...state,
    isOpen: true,
    message,
    title,
    confirmAction,
  })),

  on(ConfirmDialogActions.closeConfirmDialog, () => ({
    ...initialConfirmDialogState,
  })),

  on(ConfirmDialogActions.acceptConfirmDialog, (state) => ({
    ...state,
    isOpen: false,
  })),
);
