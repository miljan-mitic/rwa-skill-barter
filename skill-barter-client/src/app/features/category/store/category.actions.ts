import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryDto } from '../dtos/category.dto';
import { Category } from '../../../common/models/category.model';
import { CategoryFilterDto } from '../dtos/category-filter.dto';
import { CategoryFilter } from './category.state';

export const CategoryActions = createActionGroup({
  source: 'Category',
  events: {
    'Create category': props<{ categoryDto: CategoryDto }>(),
    'Create category success': props<{ category: Category }>(),
    'Create category failure': props<{ error: any }>(),

    'Load categories': props<{ categoryFilterDto: CategoryFilterDto }>(),
    'Load categories success': props<{ categories: Category[]; length: number }>(),
    'Load categories failure': props<{ error: any }>(),

    'Restart category filter': emptyProps(),
    'Change category filter': props<{
      filter: CategoryFilter;
    }>(),

    'Delete category': props<{ id: number }>(),
    'Delete category success': emptyProps(),
    'Delete category failure': props<{ error: any }>(),
  },
});
