import { inject } from '@angular/core';
import { AuthState } from '../store/auth.state';
import { AuthActions } from '../store/auth.actions';
import { Store } from '@ngrx/store';
import { KEYS } from '../../../common/constants/keys.const';

export const authInitializer = () => {
  const store = inject(Store<AuthState>);
  const accessToken = localStorage.getItem(KEYS.ACCESS_TOKEN);
  if (accessToken) {
    store.dispatch(AuthActions.autoLogin({ accessToken }));
  }
};
