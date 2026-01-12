import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Booking } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookings: Booking[] = [];
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  private nextId = 1;

  constructor() {
    // Clear any existing bookings and start fresh
    localStorage.removeItem('bookings');
    this.bookings = [];
    this.bookingsSubject.next(this.bookings);
  }

  getBookings(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }

  getBookingsByUser(userId: number): Observable<Booking[]> {
    return new Observable(observer => {
      const userBookings = this.bookings.filter(b => b.userId === userId);
      observer.next(userBookings);
      observer.complete();
    });
  }

  createBooking(booking: Booking): Observable<Booking> {
    return new Observable(observer => {
      const newBooking: Booking = {
        ...booking,
        id: booking.id || this.nextId++,
        bookingDate: booking.bookingDate || new Date(),
        status: booking.status || 'confirmed'
      };
      this.bookings.push(newBooking);
      this.saveToLocalStorage();
      this.bookingsSubject.next(this.bookings);
      observer.next(newBooking);
      observer.complete();
    });
  }

  cancelBooking(id: number): Observable<boolean> {
    return new Observable(observer => {
      const booking = this.bookings.find(b => b.id === id);
      if (booking) {
        booking.status = 'cancelled';
        this.saveToLocalStorage();
        this.bookingsSubject.next(this.bookings);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('bookings', JSON.stringify(this.bookings));
  }
}
