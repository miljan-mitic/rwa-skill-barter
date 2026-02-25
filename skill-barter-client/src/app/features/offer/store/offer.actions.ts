import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OfferFilterDto } from '../dtos/offer-filter.dto';
import { Offer } from '../../../common/models/offer.model';
import { OfferDto } from '../dtos/offer.dto';
import { OfferUpdateDto } from '../dtos/offer-update.dto';
import { OfferFilter } from './offer.state';

export const OfferActions = createActionGroup({
  source: 'Offer',
  events: {
    'Create offer': props<{ offerDto: OfferDto }>(),
    'Create offer success': props<{ offer: Offer }>(),
    'Create offer failure': props<{ error: any }>(),

    'Load offers': props<{ offerFilterDto: OfferFilterDto; isAdmin?: boolean }>(),
    'Load offers success': props<{ offers: Offer[]; length: number }>(),
    'Load offers failure': props<{ error: any }>(),

    'Change offer filter': props<{ filter: OfferFilter }>(),

    'Load offer': props<{ id: number; isAdmin?: boolean }>(),
    'Load offer success': props<{ offer: Offer }>(),
    'Load offer failure': props<{ error: any }>(),

    'Update offer': props<{ id: number; offerUpdateDto: OfferUpdateDto }>(),
    'Update offer success': props<{ offer: Offer }>(),
    'Update offer failure': props<{ error: any }>(),

    'Delete offer': props<{ id: number }>(),
    'Delete offer success': emptyProps(),
    'Delete offer failure': props<{ error: any }>(),
  },
});
