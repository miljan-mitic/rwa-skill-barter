import { createActionGroup, props } from '@ngrx/store';
import { ReviewDto } from '../dtos/review.dto';
import { Review } from '../../../common/models/review.model';

export const ReviewActions = createActionGroup({
  source: 'Review',
  events: {
    'Create review': props<{ reviewDto: ReviewDto }>(),
    'Create review success': props<{ review: Review }>(),
    'Create review failure': props<{ error: any }>(),
  },
});
