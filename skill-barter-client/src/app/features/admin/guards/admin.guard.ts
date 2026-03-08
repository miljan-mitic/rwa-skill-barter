import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from '../../user/state/user.state';
import { selectCurrentUser } from '../../user/state/user.selectors';
import { filter, map, take } from 'rxjs';
import { Role } from '../../../common/enums/role.enum';

const adminGuard = () => {
  const store = inject(Store<UserState>);
  const router = inject(Router);
  return store.select(selectCurrentUser).pipe(
    filter((user) => !!user),
    take(1),
    map((user) => {
      return user!.role === Role.ADMIN ? true : router.createUrlTree(['/dashboard']);
    }),
  );
};

export const canActivateAdmin: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return adminGuard();
};

export const canMatchAdmin: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return adminGuard();
};
