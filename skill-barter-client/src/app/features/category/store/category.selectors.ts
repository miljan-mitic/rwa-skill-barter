import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryFilter, CategoryState } from './category.state';
import { Category } from '../../../common/models/category.model';

export const selectCategoryFeature = createFeatureSelector<CategoryState>('category');

export const selectCategoryList = createSelector(selectCategoryFeature, (state: CategoryState) =>
  state.ids.reduce((acc: Category[], id: string | number) => {
    const category = state.entities[id];
    if (category) {
      acc.push(category);
    }
    return acc;
  }, []),
);

export const selectCategoryLength = createSelector(
  selectCategoryFeature,
  (state: CategoryState) => state.length,
);

export const selectCategoryLoading = createSelector(
  selectCategoryFeature,
  (state: CategoryState) => state.loading,
);

export const selectCategoryFilter = createSelector(
  selectCategoryFeature,
  (state: CategoryState) => state.filter,
);

export const selectCategoryPaginationParams = createSelector(
  selectCategoryFilter,
  (state: CategoryFilter) => ({ page: state.page, pageSize: state.pageSize }),
);
