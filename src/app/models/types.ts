// Common utility types for the application

// Result type for operations that can fail
export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly success: true;
  readonly data: T;
}

export interface Failure<E> {
  readonly success: false;
  readonly error: E;
}

// Helper functions to create Result types
export function success<T>(data: T): Success<T> {
  return { success: true, data };
}

export function failure<E>(error: E): Failure<E> {
  return { success: false, error };
}

// Type for search/filter criteria
export interface SearchCriteria<T> {
  readonly searchTerm?: string;
  readonly sortBy?: keyof T;
  readonly sortOrder?: 'asc' | 'desc';
  readonly filters?: Partial<T>;
}

// Type for pagination
export interface PaginationParams {
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

// Type for date range
export interface DateRange {
  readonly from: Date;
  readonly to: Date;
}

// Type for ID-based entities
export interface Entity {
  readonly id: number;
}

// Generic type for arrays with at least one element
export type NonEmptyArray<T> = [T, ...T[]];

// Type for sorting order
export type SortOrder = 'asc' | 'desc';

// Type for view modes
export type ViewMode = 'grid' | 'list';

// Type for loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Type guard for checking if array is non-empty
export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

// Helper to assert non-null
export function assertNonNull<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value is null or undefined');
  }
}

// Deep readonly type
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
