export interface ApiPage<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}
