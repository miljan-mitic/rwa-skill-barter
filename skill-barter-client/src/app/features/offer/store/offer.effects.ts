import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OfferService } from '../services/offer.service';
import { OfferActions } from './offer.actions';
import { catchError, concatMap, EMPTY, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class OfferEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly offerService = inject(OfferService);
  private readonly notificationService = inject(NotificationService);

  createOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferActions.createOffer),
      exhaustMap(({ offerDto }) =>
        this.offerService.create(offerDto).pipe(
          map((offer) => OfferActions.createOfferSuccess({ offer })),
          catchError((error) => of(OfferActions.createOfferFailure(error))),
        ),
      ),
    ),
  );

  createOfferSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OfferActions.createOfferSuccess),
        tap(({ offer }) => {
          this.router.navigate(['/dashboard/offers', offer.id]);
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Offfer created successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  loadOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferActions.loadOffers),
      switchMap(({ offerFilterDto, isAdmin }) =>
        this.offerService.get(offerFilterDto, isAdmin).pipe(
          map(({ items, totalItems }) =>
            OfferActions.loadOffersSuccess({ offers: items, length: totalItems }),
          ),
          catchError((error) => of(OfferActions.loadOffersFailure(error))),
        ),
      ),
    ),
  );

  loadOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferActions.loadOffer),
      switchMap(({ id, isAdmin }) =>
        this.offerService.getById(id, isAdmin).pipe(
          map((offer) => OfferActions.loadOfferSuccess({ offer })),
          catchError((error) => of(OfferActions.loadOfferFailure(error))),
        ),
      ),
    ),
  );

  updateOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferActions.updateOffer),
      concatMap(({ id, offerUpdateDto }) =>
        this.offerService.update(id, offerUpdateDto).pipe(
          map((offer) => OfferActions.updateOfferSuccess({ offer })),
          catchError((error) => of(OfferActions.updateOfferFailure(error))),
        ),
      ),
    ),
  );

  deleteOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferActions.deleteOffer),
      mergeMap(({ id }) =>
        this.offerService.delete(id).pipe(
          map(() => OfferActions.deleteOfferSuccess()),
          catchError((error) => of(OfferActions.deleteOfferFailure(error))),
        ),
      ),
    ),
  );

  deleteOfferSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OfferActions.deleteOfferSuccess),
        tap(() => {
          this.router.navigate(['/dashboard/offers']);
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Offer deleted successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  offerFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        OfferActions.createOfferFailure,
        OfferActions.loadOffersFailure,
        OfferActions.loadOfferFailure,
        OfferActions.updateOfferFailure,
        OfferActions.deleteOfferFailure,
      ),
      mergeMap(({ error }) => {
        console.error('Offer Error:', error);
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
