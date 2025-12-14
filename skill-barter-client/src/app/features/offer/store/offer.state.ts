import { EntityState } from '@ngrx/entity';
import { Offer } from '../../../common/models/offer.model';
import { OfferFilter } from '../interfaces/offer-filter.interface';

export interface OfferState extends EntityState<Offer> {
  filter?: OfferFilter;
  length: number;
}
