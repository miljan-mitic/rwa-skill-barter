import { PaginationParams } from '../interfaces/pagination-params.interface';

export type FilterParams<T, K extends PaginationParams<T>> = Partial<K>;
