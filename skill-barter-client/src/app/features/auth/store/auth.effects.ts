import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { KEYS } from '../../../common/constants/keys.const';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ signupAuthDto }) =>
        this.authService.signup(signupAuthDto).pipe(
          map(({ accessToken, user }) => AuthActions.signupSuccess({ accessToken, user })),
          catchError((error) => of(AuthActions.signupFailure({ error }))),
        ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ loginAuthDto }) =>
        this.authService.login(loginAuthDto).pipe(
          map(({ accessToken, user }) => AuthActions.loginSuccess({ accessToken, user })),
          catchError((error) => of(AuthActions.loginFailure({ error }))),
        ),
      ),
    ),
  );

  saveAccessToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.signupSuccess),
        tap(({ accessToken, user: { username }, type }) => {
          if (accessToken) {
            localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
            this.router.navigate(['/dashboard']);
            const message =
              type === AuthActions.signupSuccess.type
                ? `Congrulations ${username}! You have successfully signed up`
                : `Logged in successfully`;
            this.notificationService.showMessage(
              NotificationSeverity.SUCCESS,
              NotificationSummary.SUCCESS,
              message,
            );
          }
        }),
      ),
    { dispatch: false },
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(({ accessToken }) =>
        this.authService.loginByToken(accessToken).pipe(
          map(({ user, accessToken }) => AuthActions.autoLoginSuccess({ user, accessToken })),
          catchError((error) => of(AuthActions.autoLoginFailure({ error }))),
        ),
      ),
    ),
  );

  autoLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.autoLoginSuccess),
        tap(({ user, accessToken }) => {
          localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          (localStorage.removeItem(KEYS.ACCESS_TOKEN), this.router.navigate(['/login']));
        }),
      ),
    { dispatch: false },
  );
}
