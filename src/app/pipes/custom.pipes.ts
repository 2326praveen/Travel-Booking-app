import { Pipe, PipeTransform } from '@angular/core';

/**
 * Currency formatter pipe for Indian Rupees
 */
@Pipe({
  name: 'inr',
  standalone: true
})
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined, showSymbol: boolean = true): string {
    if (value === null || value === undefined) return '₹0';
    
    const symbol = showSymbol ? '₹' : '';
    return `${symbol}${value.toLocaleString('en-IN')}`;
  }
}

/**
 * Truncate text pipe with ellipsis
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit - ellipsis.length) + ellipsis;
  }
}

/**
 * Time ago pipe (e.g., "2 hours ago")
 */
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    
    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }
}

/**
 * Highlight search term pipe
 */
@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(value: string | null | undefined, searchTerm: string | null | undefined): string {
    if (!value || !searchTerm) return value || '';

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return value.replace(regex, '<mark>$1</mark>');
  }
}

/**
 * Safe HTML pipe (sanitizes HTML)
 */
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    
    // Remove potentially dangerous tags
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '');
  }
}

/**
 * Pluralize pipe
 */
@Pipe({
  name: 'pluralize',
  standalone: true
})
export class PluralizePipe implements PipeTransform {
  transform(count: number, singular: string, plural?: string): string {
    if (count === 1) return `${count} ${singular}`;
    
    const pluralForm = plural || `${singular}s`;
    return `${count} ${pluralForm}`;
  }
}

/**
 * Days from now pipe
 */
@Pipe({
  name: 'daysFromNow',
  standalone: true
})
export class DaysFromNowPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Past date';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  }
}

/**
 * Filter array pipe
 */
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[] | null | undefined, searchTerm: string, keys: (keyof T)[]): T[] {
    if (!items || !searchTerm || searchTerm.length === 0) return items || [];

    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      keys.some(key => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }
}

/**
 * Sort array pipe
 */
@Pipe({
  name: 'sort',
  standalone: true,
  pure: false
})
export class SortPipe implements PipeTransform {
  transform<T>(items: T[] | null | undefined, key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    if (!items) return [];

    return [...items].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return order === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }
}

/**
 * Phone number formatter pipe
 */
@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: string | null | undefined, format: 'indian' | 'international' = 'indian'): string {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');

    if (format === 'indian' && cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return value;
  }
}

/**
 * File size formatter pipe
 */
@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number | null | undefined, precision: number = 2): string {
    if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(precision))} ${sizes[i]}`;
  }
}
