import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';
import { catchError, concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfile),
      concatMap(({ userUpdateDto }) =>
        this.userService.updateProfile(userUpdateDto).pipe(
          map((user) => UserActions.updateProfileSuccess({ user })),
          catchError((error) => of(UserActions.updateProfileFailure(error))),
        ),
      ),
    ),
  );

  updateProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.updateProfileSuccess),
        tap(() =>
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Profile updated successfully',
          ),
        ),
      ),
    { dispatch: false },
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({ userFilterDto }) =>
        this.userService.get(userFilterDto).pipe(
          map(({ items, totalItems }) =>
            UserActions.loadUsersSuccess({ users: items, length: totalItems }),
          ),
          catchError((error) => of(UserActions.loadUsersFailure(error))),
        ),
      ),
    ),
  );

  userFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfileFailure, UserActions.loadUsersFailure),
      mergeMap(({ error }) => {
        console.error('User Error:', error);
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
