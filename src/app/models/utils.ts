// Type-safe utility functions for the application

import { Package, PriceCategory, Destination, Booking, BookingStatus } from './index';

/**
 * Calculates the availability status of a package
 */
export function isPackageAvailable(pkg: Package, date: Date = new Date()): boolean {
  const availableFrom = new Date(pkg.availableFrom);
  const availableTo = new Date(pkg.availableTo);
  return date >= availableFrom && date <= availableTo;
}

/**
 * Calculates days until a package becomes available
 */
export function getDaysUntilAvailable(pkg: Package): number {
  const availableFrom = new Date(pkg.availableFrom);
  const today = new Date();
  const diffTime = availableFrom.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Formats price with currency symbol
 */
export function formatPrice(price: number, currency: string = '₹'): string {
  return `${currency}${price.toLocaleString('en-IN')}`;
}

/**
 * Calculates total booking price
 */
export function calculateTotalPrice(packagePrice: number, travelers: number): number {
  if (travelers < 1) {
    throw new Error('Number of travelers must be at least 1');
  }
  return packagePrice * travelers;
}

/**
 * Gets availability color based on days until available
 */
export function getAvailabilityColor(pkg: Package): string {
  const daysUntil = getDaysUntilAvailable(pkg);
  
  if (daysUntil === 0) return '#4caf50'; // green - available now
  if (daysUntil <= 7) return '#4caf50'; // green - available soon
  if (daysUntil <= 30) return '#ff9800'; // orange - available this month
  return '#2196f3'; // blue - available later
}

/**
 * Filters array by search term (case-insensitive)
 */
export function filterBySearchTerm<T extends Record<string, unknown>>(
  items: readonly T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return [...items];
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(term);
    })
  );
}

/**
 * Sorts array by a specific field
 */
export function sortBy<T>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
}

/**
 * Groups items by a specific field
 */
export function groupBy<T, K extends keyof T>(
  items: readonly T[],
  key: K
): Map<T[K], T[]> {
  return items.reduce((map, item) => {
    const groupKey = item[key];
    const group = map.get(groupKey) || [];
    group.push(item);
    map.set(groupKey, group);
    return map;
  }, new Map<T[K], T[]>());
}

/**
 * Checks if a booking can be cancelled
 */
export function canCancelBooking(booking: Booking): boolean {
  return booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed;
}

/**
 * Gets the status color for a booking
 */
export function getBookingStatusColor(status: BookingStatus): string {
  const colorMap: Record<BookingStatus, string> = {
    [BookingStatus.Pending]: '#ff9800',
    [BookingStatus.Confirmed]: '#4caf50',
    [BookingStatus.Cancelled]: '#f44336',
    [BookingStatus.Completed]: '#2196f3',
  };
  return colorMap[status];
}

/**
 * Validates if a date is within a valid range
 */
export function isDateInRange(date: Date, minDate: Date, maxDate: Date): boolean {
  return date >= minDate && date <= maxDate;
}

/**
 * Creates a safe copy of an object (deep clone)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Truncates text to a specified length
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}
