export interface PagedResult<T> {
    items: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  }