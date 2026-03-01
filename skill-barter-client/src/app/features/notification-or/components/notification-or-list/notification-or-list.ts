import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { combineLatest, filter, Observable } from 'rxjs';
import { NotificationOR } from '../../../../common/models/notification-or.model';
import { Store } from '@ngrx/store';
import { NotificationORState } from '../../store/notification-or.state';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectNotificationORFilter,
  selectNotificationORLength,
  selectNotificationORList,
  selectNotificationORLoading,
  selectNotificationORPaginationParamas,
} from '../../store/notification-or.selectors';
import { NotificationORActions } from '../../store/notification-or.actions';
import { Role } from '../../../../common/enums/role.enum';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgClass } from '@angular/common';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { NotificationORItem } from '../notification-or-item/notification-or-item';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-or-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    AsyncPipe,
    NgClass,
    Loader,
    EmptyState,
    NotificationORItem,
  ],
  templateUrl: './notification-or-list.html',
  styleUrl: './notification-or-list.scss',
})
export class NotificationORList implements OnInit {
  notificationsOR$: Observable<NotificationOR[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams>;
  loading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<NotificationORState>);

  ngOnInit(): void {
    this.loadNotificationsOR();

    this.length$ = this.store.select(selectNotificationORLength);
    this.paginationParams$ = this.store.select(selectNotificationORPaginationParamas);
    this.loading$ = this.store.select(selectNotificationORLoading);
  }

  private loadNotificationsOR() {
    combineLatest([
      this.store.select(selectNotificationORFilter),
      this.store.select(selectCurrentUser),
    ])
      .pipe(
        filter(([_, user]) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([filter, user]) => {
        this.store.dispatch(
          NotificationORActions.loadNotificationsOR({
            notificationORFilterDto: filter || {},
            ...(user?.role === Role.ADMIN ? { isAdmin: true } : {}),
          }),
        );
      });

    this.notificationsOR$ = this.store.select(selectNotificationORList);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      NotificationORActions.changeNotificationORFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }

  onSeen() {
    this.store.dispatch(
      NotificationORActions.seenNotificationsOR({ notificationsSeenDto: { markAll: true } }),
    );
  }
}
