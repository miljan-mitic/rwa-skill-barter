import { createActionGroup, props } from '@ngrx/store';
import { OfferRequestDto } from '../dtos/offer-request.dto';
import { OfferRequest } from '../../../common/models/offer-request.model';
import { OfferRequestFilterDto } from '../dtos/offer-request-filter.dto';
import { OfferRequestFilter } from './offer-request.state';
import { OfferRequestStatus } from '../../../common/enums/offer-request-status.enum';

export const OfferRequestActions = createActionGroup({
  source: 'OfferRequest',
  events: {
    'Create offer request': props<{ offerRequestDto: OfferRequestDto }>(),
    'Create offer request success': props<{ offerRequest: OfferRequest }>(),
    'Create offer request failure': props<{ error: any }>(),

    'Load offer requests': props<{
      offerRequestFilterDto: OfferRequestFilterDto;
      isAdmin?: boolean;
    }>(),
    'Load offer requests success': props<{ offerRequests: OfferRequest[]; length: number }>(),
    'Load offer requests failure': props<{ error: any }>(),

    'Change offer request filter': props<{ filter: OfferRequestFilter }>(),

    'Change offer request status': props<{ id: number; status: OfferRequestStatus }>(),
    'Change offer request status success': props<{ offerRequest: OfferRequest }>(),
    'Change offer request status failure': props<{ error: any }>(),
  },
});
