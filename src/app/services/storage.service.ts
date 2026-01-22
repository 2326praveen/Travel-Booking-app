import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * Storage types
 */
export type StorageType = 'local' | 'session';

/**
 * Storage item interface
 */
export interface StorageItem<T> {
  key: string;
  value: T;
  timestamp: number;
  expiry?: number; // in milliseconds
}

/**
 * Storage Service
 * Wrapper for localStorage and sessionStorage with type safety and expiration support
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSubjects = new Map<string, BehaviorSubject<any>>();

  /**
   * Set item in storage
   */
  setItem<T>(key: string, value: T, storageType: StorageType = 'local', expiryMs?: number): void {
    try {
      const storage = this.getStorage(storageType);
      const item: StorageItem<T> = {
        key,
        value,
        timestamp: Date.now(),
        expiry: expiryMs
      };
      
      storage.setItem(key, JSON.stringify(item));
      this.notifySubscribers(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  /**
   * Get item from storage
   */
  getItem<T>(key: string, storageType: StorageType = 'local'): T | null {
    try {
      const storage = this.getStorage(storageType);
      const itemStr = storage.getItem(key);
      
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);
      
      // Check if item has expired
      if (item.expiry && Date.now() - item.timestamp > item.expiry) {
        this.removeItem(key, storageType);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string, storageType: StorageType = 'local'): void {
    try {
      const storage = this.getStorage(storageType);
      storage.removeItem(key);
      this.notifySubscribers(key, null);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  /**
   * Clear all items from storage
   */
  clear(storageType: StorageType = 'local'): void {
    try {
      const storage = this.getStorage(storageType);
      storage.clear();
      this.storageSubjects.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Check if key exists in storage
   */
  hasItem(key: string, storageType: StorageType = 'local'): boolean {
    return this.getItem(key, storageType) !== null;
  }

  /**
   * Get all keys from storage
   */
  getAllKeys(storageType: StorageType = 'local'): string[] {
    try {
      const storage = this.getStorage(storageType);
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   */
  getStorageSize(storageType: StorageType = 'local'): number {
    try {
      const storage = this.getStorage(storageType);
      let size = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          if (value) {
            size += key.length + value.length;
          }
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  /**
   * Watch for changes to a specific key
   */
  watch<T>(key: string, storageType: StorageType = 'local'): Observable<T | null> {
    if (!this.storageSubjects.has(key)) {
      const initialValue = this.getItem<T>(key, storageType);
      this.storageSubjects.set(key, new BehaviorSubject<T | null>(initialValue));
    }
    return this.storageSubjects.get(key)!.asObservable() as Observable<T | null>;
  }

  /**
   * Remove expired items
   */
  cleanExpired(storageType: StorageType = 'local'): void {
    try {
      const storage = this.getStorage(storageType);
      const keysToRemove: string[] = [];

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const itemStr = storage.getItem(key);
          if (itemStr) {
            try {
              const item: StorageItem<unknown> = JSON.parse(itemStr);
              if (item.expiry && Date.now() - item.timestamp > item.expiry) {
                keysToRemove.push(key);
              }
            } catch {
              // Invalid JSON, remove it
              keysToRemove.push(key);
            }
          }
        }
      }

      keysToRemove.forEach(key => this.removeItem(key, storageType));
      console.log(`Cleaned ${keysToRemove.length} expired items`);
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  }

  /**
   * Get storage instance
   */
  private getStorage(storageType: StorageType): Storage {
    return storageType === 'local' ? localStorage : sessionStorage;
  }

  /**
   * Notify subscribers of changes
   */
  private notifySubscribers<T>(key: string, value: T | null): void {
    const subject = this.storageSubjects.get(key);
    if (subject) {
      subject.next(value);
    }
  }
}

/**
 * Typed storage helpers
 */
export class TypedStorage<T> {
  constructor(
    private storageService: StorageService,
    private key: string,
    private storageType: StorageType = 'local'
  ) {}

  set(value: T, expiryMs?: number): void {
    this.storageService.setItem(this.key, value, this.storageType, expiryMs);
  }

  get(): T | null {
    return this.storageService.getItem<T>(this.key, this.storageType);
  }

  remove(): void {
    this.storageService.removeItem(this.key, this.storageType);
  }

  watch(): Observable<T | null> {
    return this.storageService.watch<T>(this.key, this.storageType);
  }

  has(): boolean {
    return this.storageService.hasItem(this.key, this.storageType);
  }
}
