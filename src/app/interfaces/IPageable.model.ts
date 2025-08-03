export interface IPageable<T> {
  page: number,
  pageSize: number,
  totalResults: number,
  totalPages: number,
  items: T[]
}
