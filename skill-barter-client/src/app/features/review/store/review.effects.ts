import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService } from '../../../shared/services/notification.service';
import { ReviewService } from '../services/review.service';
import { ReviewActions } from './review.actions';
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, switchMap } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { BarterActions } from '../../barter/store/barter.actions';

@Injectable()
export class ReviewEffects {
  private readonly actions$ = inject(Actions);
  private readonly reviewService = inject(ReviewService);
  private readonly notificationService = inject(NotificationService);

  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.createReview),
      exhaustMap(({ reviewDto }) =>
        this.reviewService.create(reviewDto).pipe(
          map((review) => ReviewActions.createReviewSuccess({ review })),
          catchError((error) => of(ReviewActions.createReviewFailure(error))),
        ),
      ),
    ),
  );

  createReviewSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.createReviewSuccess),
      switchMap(({ review }) => {
        if (review.barter) {
          return of(BarterActions.setHasReview({ barter: review.barter }));
        }
        return EMPTY;
      }),
    ),
  );

  reviewFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.createReviewFailure),
      mergeMap(({ error }) => {
        console.error('Review Error:', error);
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
