import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking, BookingStatus, CreateBookingDto, isBooking } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly bookings: Booking[] = [];
  private nextId = 1;

  getBookings(): Observable<readonly Booking[]> {
    return of([...this.bookings] as const);
  }

  getBookingsByUser(userId: number): Observable<readonly Booking[]> {
    if (userId < 1) {
      return throwError(() => new Error('Invalid user ID'));
    }
    return of(this.bookings.filter(b => b.userId === userId));
  }

  getBookingById(id: number): Observable<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    return of(booking ?? null);
  }

  createBooking(bookingData: CreateBookingDto): Observable<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: this.nextId++,
      bookingDate: new Date(),
      status: bookingData.status ?? BookingStatus.Confirmed
    };
    
    if (!isBooking(newBooking)) {
      return throwError(() => new Error('Invalid booking data'));
    }
    
    this.bookings.push(newBooking);
    return of(newBooking);
  }

  updateBookingStatus(id: number, status: BookingStatus): Observable<Booking | null> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return of(null);
    }
    
    const currentBooking = this.bookings[index]!;
    const updatedBooking: Booking = {
      id: currentBooking.id,
      userId: currentBooking.userId,
      packageId: currentBooking.packageId,
      packageName: currentBooking.packageName,
      destinationName: currentBooking.destinationName,
      numberOfTravelers: currentBooking.numberOfTravelers,
      travelDate: currentBooking.travelDate,
      specialRequests: currentBooking.specialRequests,
      totalPrice: currentBooking.totalPrice,
      bookingDate: currentBooking.bookingDate,
      status
    };
    this.bookings[index] = updatedBooking;
    return of(updatedBooking);
  }

  cancelBooking(id: number): Observable<boolean> {
    return this.updateBookingStatus(id, BookingStatus.Cancelled).pipe(
      map(booking => booking !== null)
    );
  }

  deleteBooking(id: number): Observable<boolean> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index > -1) {
      this.bookings.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
