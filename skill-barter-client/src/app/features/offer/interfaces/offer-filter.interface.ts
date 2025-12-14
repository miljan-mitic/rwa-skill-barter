import { OfferFilterDto } from '../dtos/offer-filter.dto';
import { Category } from '../../../common/models/category.model';
import { User } from '../../../common/models/user.model';

export interface OfferFilter extends OfferFilterDto {
  selectedCategory?: Category;
  selectedUser?: User;
}
