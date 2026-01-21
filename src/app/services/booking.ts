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
