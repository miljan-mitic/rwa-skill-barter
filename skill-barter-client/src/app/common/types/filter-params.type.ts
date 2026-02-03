import { PaginationParams } from '../interfaces/pagination-params.interface';

export type FilterParams<T extends PaginationParams> = Partial<T>;
