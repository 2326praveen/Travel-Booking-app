import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Destination } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private dataUrl = '/assets/data/destinations.json';

  constructor(private http: HttpClient) {}

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.dataUrl);
  }

  getDestinationById(id: number): Observable<Destination | undefined> {
    return new Observable(observer => {
      this.getDestinations().subscribe(destinations => {
        observer.next(destinations.find(d => d.id === id));
        observer.complete();
      });
    });
  }
}
