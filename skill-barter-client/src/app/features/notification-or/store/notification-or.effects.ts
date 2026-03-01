import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, EMPTY, filter, map, mergeMap, of, switchMap, take } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationORActions } from './notification-or.actions';
import { NotificationORService } from '../services/notification-or.service';
import { Store } from '@ngrx/store';
import { SocketState } from '../../../shared/socket/store/socket.state';
import { selectSocketInitialzed } from '../../../shared/socket/store/socket.selector';
import { NotificationOR } from '../../../common/models/notification-or.model';
import { SocketEventType } from '../../../common/enums/socket-event-type.enum';
import { SocketManagerService } from '../../../shared/socket/services/socket-manager.service';
import { UpdateNotificationOR } from './notification-or.state';

@Injectable()
export class NotificationOREffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<SocketState>);
  private readonly notificationORService = inject(NotificationORService);
  private readonly socketManagerService = inject(SocketManagerService);
  private readonly notificationService = inject(NotificationService);

  loadNotificationsOR$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationORActions.loadNotificationsOR),
      switchMap(({ notificationORFilterDto, isAdmin }) =>
        this.notificationORService.get(notificationORFilterDto, isAdmin).pipe(
          map(({ items, totalItems }) =>
            NotificationORActions.loadNotificationsORSuccess({
              notificationsOR: items,
              length: totalItems,
            }),
          ),
          catchError((error) => of(NotificationORActions.loadNotificationsORFailure(error))),
        ),
      ),
    ),
  );

  loadNumberUnseen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationORActions.loadNumberUnseenNotificationsOR),
      switchMap(() =>
        this.notificationORService.getNumberUnseen().pipe(
          map(({ numberUnseen }) =>
            NotificationORActions.loadNumberUnseenNotificationsORSuccess({ numberUnseen }),
          ),
          catchError((error) =>
            of(NotificationORActions.loadNumberUnseenNotificationsORFailure(error)),
          ),
        ),
      ),
    ),
  );

  listenToNotificationsOR$ = createEffect(() =>
    this.store.select(selectSocketInitialzed).pipe(
      filter(Boolean),
      take(1),
      switchMap(() =>
        this.socketManagerService
          .onNotification<NotificationOR>(SocketEventType.NOTIFICATIONS_OR)
          .pipe(
            map((notificationOR) =>
              NotificationORActions.notificationORReceived({ notificationOR }),
            ),
          ),
      ),
    ),
  );

  seenNotificationOR$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationORActions.seenNotificationsOR),
      concatMap(({ notificationsSeenDto }) =>
        this.notificationORService.seen(notificationsSeenDto).pipe(
          map((notificationsOR) => {
            const updatedNotificationsOR: UpdateNotificationOR[] = notificationsOR.map(
              ({ id, ...restData }) => ({
                id,
                changes: restData,
              }),
            );
            return NotificationORActions.seenNotificationsORSuccess({ updatedNotificationsOR });
          }),
          catchError((error) => of(NotificationORActions.seenNotificationsORFailure(error))),
        ),
      ),
    ),
  );

  notificationORFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        NotificationORActions.loadNotificationsORFailure,
        NotificationORActions.loadNumberUnseenNotificationsORFailure,
        NotificationORActions.seenNotificationsORFailure,
      ),
      mergeMap(({ error }) => {
        console.error('NotificationOR Error:', error);
        if (error?.statusCode === HttpStatusCode.Unauthorized) {
          return of(AuthActions.unauthorizedAccess());
        }

        this.notificationService.showMessage(
          NotificationSeverity.ERROR,
          NotificationSummary.ERROR,
          error?.message || 'An unexpected error occurred',
        );

        return EMPTY;
      }),
    ),
  );
}
