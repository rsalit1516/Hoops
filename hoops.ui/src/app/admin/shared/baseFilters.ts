export interface BaseFilters {
  searchText?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  pageNumber?: number;
}
