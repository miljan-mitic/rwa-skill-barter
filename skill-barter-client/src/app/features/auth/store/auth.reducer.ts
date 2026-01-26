import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.state';
import { AuthStatus } from '../../../common/enums/auth-status.enum';

export const initilState: AuthState = {
  status: AuthStatus.IDLE,
};

export const authReducer = createReducer(
  initilState,
  on(AuthActions.autoLogin, AuthActions.login, AuthActions.signup, (state) => ({
    ...state,
    status: AuthStatus.LOADING,
  })),
  on(
    AuthActions.signupSuccess,
    AuthActions.loginSuccess,
    AuthActions.autoLoginSuccess,
    (state, { accessToken }) => ({
      ...state,
      status: AuthStatus.AUTHENTICATED,
      accessToken,
    }),
  ),
  on(
    AuthActions.signupFailure,
    AuthActions.loginFailure,
    AuthActions.autoLoginFailure,
    AuthActions.logout,
    (state) => ({
      ...state,
      status: AuthStatus.UNAUTHENTICATED,
      accessToken: undefined,
    }),
  ),
);
