import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService } from '../../../shared/services/notification.service';
import { BarterActions } from './barter.actions';
import { BarterService } from '../services/barter.service';
import {
  catchError,
  combineLatest,
  concatMap,
  distinctUntilChanged,
  EMPTY,
  interval,
  map,
  merge,
  mergeMap,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { Store } from '@ngrx/store';
import { BarterState } from './barter.state';
import { selectBarterMeetingsStatesPollingConfig } from './barter.selectors';
import { PageVisibilityService } from '../../../shared/services/page-visibility.service';
import { RouteActivityService } from '../../../shared/services/route-activity.service';

@Injectable()
export class BarterEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<BarterState>);
  private readonly barterService = inject(BarterService);
  private readonly notificationService = inject(NotificationService);
  private readonly pageVisibilityService = inject(PageVisibilityService);
  private readonly routeActivityService = inject(RouteActivityService);

  loadBarters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BarterActions.loadBarters),
      switchMap(({ barterFilterDto }) =>
        this.barterService.get(barterFilterDto).pipe(
          map(({ items, totalItems }) =>
            BarterActions.loadBartersSuccess({ barters: items, length: totalItems }),
          ),
          catchError((error) => of(BarterActions.loadBartersFailure(error))),
        ),
      ),
    ),
  );

  meetingBulkPolling$ = createEffect(() =>
    combineLatest([
      this.store.select(selectBarterMeetingsStatesPollingConfig),
      this.pageVisibilityService.visibility$,
      this.routeActivityService.isBartersRoute$,
    ]).pipe(
      distinctUntilChanged(
        ([pConfig, pVisible, pRoute], [cConfig, cVisible, cRoute]) =>
          pVisible === cVisible &&
          pRoute === cRoute &&
          pConfig?.intervalMs === cConfig?.intervalMs &&
          JSON.stringify(pConfig?.barterIds) === JSON.stringify(cConfig?.barterIds),
      ),
      switchMap(([config, isVisible, isOnBartersRoute]) => {
        if (!config || !isVisible || !isOnBartersRoute) {
          return EMPTY;
        }

        return merge(
          of(BarterActions.loadMeetingsStates({ barterIds: config.barterIds })),
          interval(config.intervalMs).pipe(
            startWith(0),
            map(() => BarterActions.loadMeetingsStates({ barterIds: config.barterIds })),
          ),
        );
      }),
    ),
  );

  loadMeetingsStates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BarterActions.loadMeetingsStates),
      switchMap(({ barterIds }) =>
        this.barterService.loadMeetingsStates(barterIds).pipe(
          map((barters) => {
            return BarterActions.loadMeetingsStatesSuccess({
              updateBarters: barters.map(({ id, ...barterData }) => ({ id, changes: barterData })),
            });
          }),
          catchError((error) => of(BarterActions.loadMeetingsStatesFailure(error))),
        ),
      ),
    ),
  );

  setHasReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BarterActions.setHasReview),
      concatMap(({ barter }) =>
        of(
          BarterActions.setHasReviewSuccess({
            updateBarter: { id: barter.id, changes: { isHasReview: true } },
          }),
        ),
      ),
    ),
  );

  barterFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BarterActions.loadBartersFailure, BarterActions.loadMeetingsStatesFailure),
      mergeMap(({ error }) => {
        console.error('Barter Error:', error);
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
