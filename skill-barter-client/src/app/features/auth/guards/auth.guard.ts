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
import { selectIsAuthenticated } from '../store/auth.selectors';
import { map, take } from 'rxjs';

const authGuard = () => {
  const store = inject(Store<AuthState>);
  const router = inject(Router);
  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return authGuard();
};

export const canMatchAuth: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return authGuard();
};
