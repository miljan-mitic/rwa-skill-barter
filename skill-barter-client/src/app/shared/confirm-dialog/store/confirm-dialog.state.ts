import { Action } from '@ngrx/store';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string | null;
  message: string | null;
  confirmAction: Action | null;
}
