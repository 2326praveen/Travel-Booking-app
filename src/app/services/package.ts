import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private dataUrl = '/assets/data/packages.json';

  constructor(private http: HttpClient) {}

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.dataUrl);
  }

  getPackageById(id: number): Observable<Package | undefined> {
    return new Observable(observer => {
      this.getPackages().subscribe(packages => {
        observer.next(packages.find(p => p.id === id));
        observer.complete();
      });
    });
  }

  getPackagesByDestination(destinationId: number): Observable<Package[]> {
    return new Observable(observer => {
      this.getPackages().subscribe(packages => {
        observer.next(packages.filter(p => p.destinationId === destinationId));
        observer.complete();
      });
    });
  }
}
