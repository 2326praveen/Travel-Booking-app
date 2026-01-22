// Type for rating values
export type Rating = 1 | 2 | 3 | 4 | 5;

// Main destination interface with readonly properties
export interface Destination {
  readonly id: number;
  readonly name: string;
  readonly country: string;
  readonly description: string;
  readonly imageUrl: string;
  rating: Rating;
  readonly popularActivities: readonly string[];
}

// Type for destination with package count
export type DestinationWithPackages = Destination & {
  readonly packageCount: number;
};

// Type for destination summary (subset of fields)
export type DestinationSummary = Pick<Destination, 'id' | 'name' | 'country' | 'rating'>;

// Type guard to validate rating
export function isValidRating(rating: number): rating is Rating {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

// Type guard to check if object is a Destination
export function isDestination(obj: unknown): obj is Destination {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'country' in obj &&
    'rating' in obj
  );
}
