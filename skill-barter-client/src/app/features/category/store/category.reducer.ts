import { createEntityAdapter } from '@ngrx/entity';
import { Category } from '../../../common/models/category.model';
import { CategoryFilter, CategoryState } from './category.state';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortType } from '../../../common/enums/sort.enum';
import { createReducer, on } from '@ngrx/store';
import { CategoryActions } from './category.actions';

const adapter = createEntityAdapter<Category>();

const initialStateFilter: CategoryFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.DEFAULT.PAGE_SIZE,
  sortBy: 'createdAt',
  sortType: SortType.DESC,
};

export const initialState: CategoryState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateFilter,
});

export const categoryReducer = createReducer(
  initialState,
  on(CategoryActions.loadCategories, (state: CategoryState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(CategoryActions.restartCategoryFilter, (state: CategoryState) => {
    return { ...state, filter: initialStateFilter };
  }),
  on(CategoryActions.changeCategoryFilter, (state: CategoryState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    };
  }),
  on(CategoryActions.loadCategoriesSuccess, (state: CategoryState, { categories, length }) => {
    return adapter.setAll(categories, {
      ...state,
      length,
      loading: false,
    });
  }),
  on(CategoryActions.loadCategoriesFailure, (state: CategoryState) => {
    return {
      ...state,
      loading: false,
    };
  }),
);
