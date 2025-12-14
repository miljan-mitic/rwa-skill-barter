import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';

export interface OfferFilterDto extends PaginationParams {
  categoryId?: number;
  minBarterCredit?: number;
  maxBarterCredit?: number;
  sortBy?: string;
  sortType?: number;
}
