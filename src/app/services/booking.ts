import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookings: Booking[] = [];
  private nextId = 1;

  getBookings(): Observable<Booking[]> {
    return of(this.bookings);
  }

  getBookingsByUser(userId: number): Observable<Booking[]> {
    return of(this.bookings.filter(b => b.userId === userId));
  }

  createBooking(booking: Booking): Observable<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: this.nextId++,
      bookingDate: new Date(),
      status: 'confirmed'
    };
    this.bookings.push(newBooking);
    return of(newBooking);
  }

  cancelBooking(id: number): Observable<boolean> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index > -1) {
      this.bookings.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
