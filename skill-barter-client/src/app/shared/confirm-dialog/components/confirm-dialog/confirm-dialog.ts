import { Component, inject, OnInit } from '@angular/core';
import { ConfirmDialogState } from '../../store/confirm-dialog.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectConfirmDialog } from '../../store/confirm.dialog.selector';
import { ConfirmDialogActions } from '../../store/confirm-dialog.actions';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, AsyncPipe],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog implements OnInit {
  confirmDialog$: Observable<ConfirmDialogState>;

  private store = inject(Store<ConfirmDialogState>);

  ngOnInit(): void {
    this.confirmDialog$ = this.store.select(selectConfirmDialog);
  }

  cancel() {
    this.store.dispatch(ConfirmDialogActions.closeConfirmDialog());
  }

  confirm() {
    this.store.dispatch(ConfirmDialogActions.acceptConfirmDialog());
  }
}
