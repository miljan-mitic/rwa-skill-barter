import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.state';

export const initilState: AuthState = {
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initilState,
  on(AuthActions.signupSuccess, AuthActions.loginSuccess, (state, { accessToken }) => ({
    ...state,
    isAuthenticated: true,
    accessToken,
  })),
  on(AuthActions.signupFailure, AuthActions.loginFailure, AuthActions.logout, (state) => ({
    ...state,
    isAuthenticated: false,
    accessToken: undefined,
  }))
);
