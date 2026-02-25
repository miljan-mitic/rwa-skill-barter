import { EntityState } from '@ngrx/entity';
import { OfferRequest } from '../../../common/models/offer-request.model';
import { OfferRequestFilterDto } from '../dtos/offer-request-filter.dto';

export interface OfferRequestState extends EntityState<OfferRequest> {
  length: number;
  loading: boolean;
  filter: OfferRequestFilter;
}

export interface OfferRequestFilter extends OfferRequestFilterDto {}
