// Application-wide constants with const assertions for type safety

// Price ranges for filtering
export const PRICE_RANGES = {
  BUDGET: { min: 0, max: 125000 },
  MID_RANGE: { min: 125000, max: 250000 },
  LUXURY: { min: 250000, max: Infinity },
} as const;

// Rating values
export const RATINGS = [1, 2, 3, 4, 5] as const;

// Traveler limits
export const TRAVELER_LIMITS = {
  MIN: 1,
  MAX: 10,
} as const;

// Date constraints
export const DATE_CONSTRAINTS = {
  MIN_DATE: new Date(),
  MAX_BOOKING_YEARS: 1,
} as const;

// View modes
export const VIEW_MODES = ['grid', 'list'] as const;

// Sort orders
export const SORT_ORDERS = ['asc', 'desc'] as const;

// Destination sort fields
export const DESTINATION_SORT_FIELDS = ['name', 'rating', 'country'] as const;

// Package sort fields
export const PACKAGE_SORT_FIELDS = ['price', 'duration', 'name'] as const;

// Booking sort fields
export const BOOKING_SORT_FIELDS = ['date', 'price', 'status'] as const;

// Filter status options
export const FILTER_STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const;

// Snackbar configuration
export const SNACKBAR_CONFIG = {
  DURATION: 3000,
  HORIZONTAL_POSITION: 'center',
  VERTICAL_POSITION: 'top',
} as const;

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  NAME_MIN_LENGTH: 3,
} as const;

// API mock delays (if using simulated API calls)
export const API_DELAYS = {
  SHORT: 500,
  MEDIUM: 1000,
  LONG: 2000,
} as const;

// Image gallery settings
export const IMAGE_GALLERY = {
  DEFAULT_WIDTH: 800,
  THUMBNAIL_SIZE: 150,
  GALLERY_COUNT: 3,
} as const;

// Type exports for const assertion usage
export type PriceRangeKey = keyof typeof PRICE_RANGES;
export type RatingValue = typeof RATINGS[number];
export type ViewModeValue = typeof VIEW_MODES[number];
export type SortOrderValue = typeof SORT_ORDERS[number];
export type DestinationSortField = typeof DESTINATION_SORT_FIELDS[number];
export type PackageSortField = typeof PACKAGE_SORT_FIELDS[number];
export type BookingSortField = typeof BOOKING_SORT_FIELDS[number];
export type FilterStatusOption = typeof FILTER_STATUS_OPTIONS[number];
