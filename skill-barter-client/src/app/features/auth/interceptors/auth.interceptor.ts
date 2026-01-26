import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { filter, Observable, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAuthStatus, selectToken } from '../store/auth.selectors';
import { AuthStatus } from '../../../common/enums/auth-status.enum';
import { FREE_ENDPOINTS } from '../../../common/constants/free-endpoints.const';

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (FREE_ENDPOINTS.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const store = inject(Store<AppState>);
  return store.select(selectAuthStatus).pipe(
    filter((status) => status !== AuthStatus.IDLE && status !== AuthStatus.LOADING),
    take(1),
    switchMap(() => store.select(selectToken).pipe(take(1))),
    switchMap((accessToken) => {
      if (accessToken) {
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });
      }
      return next(req);
    }),
  );
};
