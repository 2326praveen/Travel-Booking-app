import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Package, PriceCategory, getPriceCategory, isPackage } from '../models';
import packagesData from '../../assets/data/packages.json';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private readonly packages: readonly Package[];

  constructor() {
    // Validate data on initialization
    const data = packagesData as unknown[];
    if (!Array.isArray(data) || !data.every(isPackage)) {
      console.error('Invalid packages data');
      this.packages = [];
    } else {
      this.packages = data;
    }
  }

  getPackages(): Observable<readonly Package[]> {
    return of(this.packages);
  }

  getPackageById(id: number): Observable<Package | null> {
    if (id < 1) {
      return throwError(() => new Error('Invalid package ID'));
    }
    const pkg = this.packages.find(p => p.id === id);
    return of(pkg ?? null);
  }

  getPackagesByDestination(destinationId: number): Observable<readonly Package[]> {
    if (destinationId < 1) {
      return throwError(() => new Error('Invalid destination ID'));
    }
    return of(this.packages.filter(p => p.destinationId === destinationId));
  }

  getPackagesByPriceRange(minPrice: number, maxPrice: number): Observable<readonly Package[]> {
    if (minPrice < 0 || maxPrice < minPrice) {
      return throwError(() => new Error('Invalid price range'));
    }
    return of(this.packages.filter(p => 
      p.price >= minPrice && p.price <= maxPrice
    ));
  }

  getPackagesByCategory(category: PriceCategory): Observable<readonly Package[]> {
    return of(this.packages.filter(p => getPriceCategory(p.price) === category));
  }

  getPackagesByDuration(minDays: number, maxDays: number): Observable<readonly Package[]> {
    if (minDays < 1 || maxDays < minDays) {
      return throwError(() => new Error('Invalid duration range'));
    }
    return of(this.packages.filter(p => 
      p.duration >= minDays && p.duration <= maxDays
    ));
  }

  getAvailablePackages(date: Date = new Date()): Observable<readonly Package[]> {
    return of(this.packages.filter(p => {
      const availableFrom = new Date(p.availableFrom);
      const availableTo = new Date(p.availableTo);
      return date >= availableFrom && date <= availableTo;
    }));
  }
}
