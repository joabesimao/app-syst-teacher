export interface Page<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

export const nextPageOf = (page: Page<unknown>) => (page.page < page.totalPages ? page.page + 1 : undefined);
