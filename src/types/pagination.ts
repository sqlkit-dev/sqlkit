import { QueryPayload } from "./query";

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export interface PaginatedResult<T> {
  nodes: T[];
  meta: PaginationMeta;
}

export interface PaginationOptions<T> extends QueryPayload<T> {
  page?: number;
  limit?: number;
}
