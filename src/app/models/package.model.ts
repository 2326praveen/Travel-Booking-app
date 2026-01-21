export interface Package {
  id: number;
  destinationId: number;
  name: string;
  description: string;
  duration: number; // in days
  price: number;
  imageUrl: string;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  availableFrom: string;
  availableTo: string;
}
