import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Barter } from '../../../common/models/barter.model';
import { BarterFilterDto } from '../dtos/barter-filter.dto';
import { BarterFilter, UpdateBarter } from './barter.state';

export const BarterActions = createActionGroup({
  source: 'Barter',
  events: {
    'Load barters': props<{ barterFilterDto: BarterFilterDto }>(),
    'Load barters success': props<{ barters: Barter[]; length: number }>(),
    'Load barters failure': props<{ error: any }>(),

    'Restart barter filter': emptyProps(),
    'Change barter filter': props<{ filter: BarterFilter }>(),

    'Load meetings states': props<{ barterIds: number[] }>(),
    'Load meetings states success': props<{ updateBarters: UpdateBarter[] }>(),
    'Load meetings states failure': props<{ error: any }>(),

    'Set has review': props<{ barter: Barter }>(),
    'Set has review success': props<{ updateBarter: UpdateBarter }>(),
  },
});
