import { Action, createActionGroup, emptyProps, props } from '@ngrx/store';

export const ConfirmDialogActions = createActionGroup({
  source: 'Confirm Dialog',
  events: {
    'Open confirm dialog': props<{ message: string; title: string; confirmAction: Action }>(),
    'Close confirm dialog': emptyProps(),
    'Accept confirm dialog': emptyProps(),
  },
});
