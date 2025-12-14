import { createActionGroup, props } from '@ngrx/store';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { OfferFilterDto } from '../dtos/offer-filter.dto';
import { Offer } from '../../../common/models/offer.model';

export const OfferActions = createActionGroup({
  source: 'Offer',
  events: {
    'Load offers': props<{ offerFilterDto: OfferFilterDto; isAdmin?: boolean }>(),
    'Load offers success': props<{ offers: Offer[]; length: number }>(),
    'Load offers failure': props<{ error: any }>(),
    'Change offer pagination filter': props<{ paginationParams: PaginationParams }>(),
  },
});
