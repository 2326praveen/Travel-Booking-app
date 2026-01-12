export interface Booking {
  id: number;
  userId: number;
  packageId: number;
  packageName: string;
  destinationName: string;
  numberOfTravelers: number;
  travelDate: Date;
  specialRequests?: string;
  totalPrice: number;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}
