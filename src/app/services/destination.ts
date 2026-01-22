import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Destination, Rating, isDestination, isValidRating } from '../models';
import destinationsData from '../../assets/data/destinations.json';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private readonly destinations: readonly Destination[];

  constructor() {
    // Validate data on initialization
    const data = destinationsData as unknown[];
    if (!Array.isArray(data) || !data.every(isDestination)) {
      console.error('Invalid destinations data');
      this.destinations = [];
    } else {
      this.destinations = data;
    }
  }

  getDestinations(): Observable<readonly Destination[]> {
    return of(this.destinations);
  }

  getDestinationById(id: number): Observable<Destination | null> {
    if (id < 1) {
      return throwError(() => new Error('Invalid destination ID'));
    }
    const destination = this.destinations.find(d => d.id === id);
    return of(destination ?? null);
  }

  getDestinationsByRating(minRating: Rating): Observable<readonly Destination[]> {
    if (!isValidRating(minRating)) {
      return throwError(() => new Error('Invalid rating value'));
    }
    return of(this.destinations.filter(d => d.rating >= minRating));
  }

  getDestinationsByCountry(country: string): Observable<readonly Destination[]> {
    const normalizedCountry = country.trim().toLowerCase();
    if (!normalizedCountry) {
      return throwError(() => new Error('Country name cannot be empty'));
    }
    return of(this.destinations.filter(d => 
      d.country.toLowerCase() === normalizedCountry
    ));
  }

  searchDestinations(searchTerm: string): Observable<readonly Destination[]> {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return this.getDestinations();
    }
    return of(this.destinations.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.country.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term)
    ));
  }
}
