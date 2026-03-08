import { EntityState } from '@ngrx/entity';
import { Category } from '../../../common/models/category.model';
import { CategoryFilterDto } from '../dtos/category-filter.dto';

export interface CategoryState extends EntityState<Category> {
  length: number;
  loading: boolean;
  filter: CategoryFilter;
}

export interface CategoryFilter extends CategoryFilterDto {}
