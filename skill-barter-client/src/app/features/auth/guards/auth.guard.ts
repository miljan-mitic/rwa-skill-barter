import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth.state';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { selectAuthStatus } from '../store/auth.selectors';
import { filter, map, take, tap } from 'rxjs';
import { AuthStatus } from '../../../common/enums/auth-status.enum';

const authGuard = () => {
  const store = inject(Store<AuthState>);
  const router = inject(Router);
  return store.select(selectAuthStatus).pipe(
    filter((status) => status !== AuthStatus.IDLE && status !== AuthStatus.LOADING),
    take(1),
    map((status) => status === AuthStatus.AUTHENTICATED),
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
  );
};

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return authGuard();
};

export const canMatchAuth: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return authGuard();
};
