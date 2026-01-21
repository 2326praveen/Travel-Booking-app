import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Destination } from '../models';
import destinationsData from '../../assets/data/destinations.json';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private destinations: Destination[] = destinationsData as Destination[];

  getDestinations(): Observable<Destination[]> {
    return of(this.destinations);
  }

  getDestinationById(id: number): Observable<Destination | undefined> {
    return of(this.destinations.find(d => d.id === id));
  }
}
