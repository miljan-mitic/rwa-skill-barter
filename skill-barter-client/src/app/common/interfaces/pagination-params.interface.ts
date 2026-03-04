import { SortType } from '../enums/sort.enum';
import { SortableKeys } from '../types/sortable-keys.type';

export interface PaginationParams<T> {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: SortableKeys<T>;
  sortType?: SortType;
}
