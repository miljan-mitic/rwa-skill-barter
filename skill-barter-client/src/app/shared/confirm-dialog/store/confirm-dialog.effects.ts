import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConfirmDialogActions } from './confirm-dialog.actions';
import { Store } from '@ngrx/store';
import { ConfirmDialogState } from './confirm-dialog.state';
import { filter, map, withLatestFrom } from 'rxjs';
import { selectConfirmDialog } from './confirm.dialog.selector';

@Injectable()
export class ConfirmDialogEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<ConfirmDialogState>);

  confirmDialogAccepted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfirmDialogActions.acceptConfirmDialog),
      withLatestFrom(this.store.select(selectConfirmDialog)),
      map(([_, state]) => state.confirmAction),
      filter((action) => !!action),
    ),
  );

  closeAfterAccept$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfirmDialogActions.acceptConfirmDialog),
      map(() => ConfirmDialogActions.closeConfirmDialog()),
    ),
  );
}
