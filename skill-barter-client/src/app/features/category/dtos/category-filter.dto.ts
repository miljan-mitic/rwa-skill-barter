import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { Category } from '../../../common/models/category.model';

export interface CategoryFilterDto extends PaginationParams<Category> {}
