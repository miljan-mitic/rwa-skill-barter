import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OfferRequestService } from '../services/offer-request.service';
import { catchError, concatMap, EMPTY, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { NotificationService } from '../../../shared/services/notification.service';
import { OfferRequestActions } from './offer-request.actions';
import { Router } from '@angular/router';
import { OFFER_REQUESTS_SECTION } from '../../../common/constants/offer-request-status.consts';

@Injectable()
export class OfferRequestEffects {
  private readonly actions$ = inject(Actions);
  private readonly offerRequestService = inject(OfferRequestService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  createOfferRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferRequestActions.createOfferRequest),
      exhaustMap(({ offerRequestDto }) =>
        this.offerRequestService.create(offerRequestDto).pipe(
          map((offerRequest) => OfferRequestActions.createOfferRequestSuccess({ offerRequest })),
          catchError((error) => of(OfferRequestActions.createOfferRequestFailure(error))),
        ),
      ),
    ),
  );

  createOfferRequestSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OfferRequestActions.createOfferRequestSuccess),
        tap((_) => {
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Sent offer request successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  loadOfferRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferRequestActions.loadOfferRequests),
      switchMap(({ offerRequestFilterDto, isAdmin }) =>
        this.offerRequestService.get(offerRequestFilterDto, isAdmin).pipe(
          map(({ items, totalItems }) =>
            OfferRequestActions.loadOfferRequestsSuccess({
              offerRequests: items,
              length: totalItems,
            }),
          ),
          catchError((error) => of(OfferRequestActions.loadOfferRequestsFailure(error))),
        ),
      ),
    ),
  );

  changeOfferRequestStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferRequestActions.changeOfferRequestStatus),
      concatMap(({ id, status }) =>
        this.offerRequestService.update(id, { status }).pipe(
          map((offerRequest) =>
            OfferRequestActions.changeOfferRequestStatusSuccess({ offerRequest }),
          ),
          catchError((error) => of(OfferRequestActions.changeOfferRequestStatusFailure(error))),
        ),
      ),
    ),
  );

  changeOfferRequestStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OfferRequestActions.changeOfferRequestStatusSuccess),
        tap(() => {
          window.location.hash = OFFER_REQUESTS_SECTION;
          window.location.reload();
        }),
      ),
    { dispatch: false },
  );

  offerRequestFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        OfferRequestActions.createOfferRequestFailure,
        OfferRequestActions.loadOfferRequestsFailure,
        OfferRequestActions.changeOfferRequestStatusFailure,
      ),
      mergeMap(({ error }) => {
        console.error('OfferRequest Error:', error);
        if (error?.statusCode === HttpStatusCode.Unauthorized) {
          return of(AuthActions.unauthorizedAccess());
        }

        this.notificationService.showMessage(
          NotificationSeverity.ERROR,
          NotificationSummary.ERROR,
          error?.message || 'An unexpected error occurred',
        );

        return EMPTY;
      }),
    ),
  );
}
