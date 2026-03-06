import { createReducer, on } from '@ngrx/store';
import { UserState } from './user.state';
import { AuthActions } from '../../auth/store/auth.actions';
import { UserActions } from './user.actions';

export const initilState: UserState = {};

export const userReducer = createReducer(
  initilState,
  on(
    AuthActions.loginSuccess,
    AuthActions.signupSuccess,
    AuthActions.autoLoginSuccess,
    (state, { user }) => ({
      ...state,
      currentUser: user,
    }),
  ),
  on(UserActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    currentUser: undefined,
  })),
);
