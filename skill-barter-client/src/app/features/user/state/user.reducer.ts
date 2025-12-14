import { createReducer, on } from '@ngrx/store';
import { UserState } from './user.state';
import { AuthActions } from '../../auth/store/auth.actions';

export const initilState: UserState = {};

export const userReducer = createReducer(
  initilState,
  on(AuthActions.loginSuccess, AuthActions.signupSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    currentUser: undefined,
  }))
);
