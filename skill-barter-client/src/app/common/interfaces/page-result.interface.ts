export interface PageResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
