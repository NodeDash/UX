/**
 * Common types used across the application
 */

/**
 * Defines ownership types in the system
 */
export enum OwnerType {
  USER = 'user',
  TEAM = 'team',
}

/**
 * Base interface for all resources that can be owned
 */
export interface OwnedResource {
  owner_type: OwnerType;
  owner_id: string;
}

/**
 * Common properties for all API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}