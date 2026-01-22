// Enum for booking status
export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed'
}

// Main booking interface with readonly properties
export interface Booking {
  readonly id: number;
  readonly userId: number;
  readonly packageId: number;
  readonly packageName: string;
  readonly destinationName: string;
  numberOfTravelers: number;
  travelDate: Date;
  specialRequests?: string;
  readonly totalPrice: number;
  readonly bookingDate: Date;
  status: BookingStatus;
}

// Type for creating a new booking (without generated fields)
export type CreateBookingDto = Omit<Booking, 'id' | 'bookingDate' | 'status'> & {
  status?: BookingStatus;
};

// Type for updating a booking (all fields optional except id)
export type UpdateBookingDto = Partial<Omit<Booking, 'id'>> & {
  readonly id: number;
};

// Type guard to check if a value is a valid BookingStatus
export function isValidBookingStatus(status: string): status is BookingStatus {
  return Object.values(BookingStatus).includes(status as BookingStatus);
}

// Type guard to check if object is a Booking
export function isBooking(obj: unknown): obj is Booking {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'userId' in obj &&
    'packageId' in obj &&
    'status' in obj
  );
}
