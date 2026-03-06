import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';
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
      concatMap(({ updateUserDto }) =>
        this.userService.updateProfile(updateUserDto).pipe(
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

  userFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfileFailure),
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
