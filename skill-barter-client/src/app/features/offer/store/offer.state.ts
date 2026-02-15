import { EntityState } from '@ngrx/entity';
import { Offer } from '../../../common/models/offer.model';
import { OfferFilterDto } from '../dtos/offer-filter.dto';
import { Category } from '../../../common/models/category.model';

export interface OfferState extends EntityState<Offer> {
  length: number;
  loading: boolean;
  filter: OfferFilter;
  detailedOffer?: Offer;
}

export interface OfferFilter extends OfferFilterDto {
  selectedCategory?: Category;
}
