import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OfferService } from '../services/offer.service';
import { OfferActions } from './offer.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class OfferEffects {
  private readonly actions$ = inject(Actions);
  private readonly offerService = inject(OfferService);

  loadOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfferActions.loadOffers),
      switchMap(({ offerFilterDto, isAdmin }) => {
        return this.offerService.get(offerFilterDto, isAdmin).pipe(
          tap((response) => console.log('Offers Loading...', response)),
          map(({ offers, length }) => OfferActions.loadOffersSuccess({ offers, length })),
          catchError((error) => of(OfferActions.loadOffersFailure({ error })))
        );
      })
    )
  );
}
