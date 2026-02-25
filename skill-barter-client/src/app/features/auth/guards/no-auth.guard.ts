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
import { filter, map, take } from 'rxjs';
import { AuthStatus } from '../../../common/enums/auth-status.enum';

const noAuthGuard = () => {
  const store = inject(Store<AuthState>);
  const router = inject(Router);
  return store.select(selectAuthStatus).pipe(
    filter((status) => status !== AuthStatus.LOADING),
    take(1),
    map((status) =>
      status === AuthStatus.AUTHENTICATED ? router.createUrlTree(['/dashboard']) : true,
    ),
  );
};

export const canActivateNoAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return noAuthGuard();
};

export const canMatchNoAuth: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return noAuthGuard();
};
