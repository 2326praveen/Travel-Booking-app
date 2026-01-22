// Type for duration in days
export type Duration = number;

// Type for price in currency
export type Price = number;

// Type for price categories
export type PriceCategory = 'budget' | 'mid-range' | 'luxury';

// Main package interface with readonly properties
export interface Package {
  readonly id: number;
  readonly destinationId: number;
  readonly name: string;
  readonly description: string;
  readonly duration: Duration;
  readonly price: Price;
  readonly imageUrl: string;
  readonly itinerary: readonly string[];
  readonly inclusions: readonly string[];
  readonly exclusions: readonly string[];
  readonly availableFrom: string;
  readonly availableTo: string;
}

// Type for package with calculated fields
export type PackageWithExtras = Package & {
  readonly priceCategory: PriceCategory;
  readonly isAvailable: boolean;
  readonly daysUntilAvailable: number;
};

// Type for package summary (subset of fields)
export type PackageSummary = Pick<Package, 'id' | 'name' | 'price' | 'duration' | 'imageUrl'>;

// Helper function to determine price category
export function getPriceCategory(price: Price): PriceCategory {
  if (price < 125000) return 'budget';
  if (price < 250000) return 'mid-range';
  return 'luxury';
}

// Type guard to check if object is a Package
export function isPackage(obj: unknown): obj is Package {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'destinationId' in obj &&
    'price' in obj
  );
}
