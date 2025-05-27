import { Property } from "@prisma/client";

export interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PropertiesResponse {
  message: string;
  success: boolean;
  properties?: Property[];
  pagination?: PaginationInfo;
}
