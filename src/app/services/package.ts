import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Package } from '../models';
import packagesData from '../../assets/data/packages.json';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private packages: Package[] = packagesData as Package[];

  getPackages(): Observable<Package[]> {
    return of(this.packages);
  }

  getPackageById(id: number): Observable<Package | undefined> {
    return of(this.packages.find(p => p.id === id));
  }

  getPackagesByDestination(destinationId: number): Observable<Package[]> {
    return of(this.packages.filter(p => p.destinationId === destinationId));
  }
}
