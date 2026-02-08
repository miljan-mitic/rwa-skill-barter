import { SortBy, SortType } from '../enums/sort.enum';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: SortBy;
  sortType?: SortType;
}
