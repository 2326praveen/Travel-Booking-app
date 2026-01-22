# Travel Booking and Destination Explorer

A modern Angular application for browsing travel destinations, viewing travel packages, and booking trips. Built with Angular 21, TypeScript, and Angular Material.

## Features

- **Browse Destinations**: Explore amazing destinations around the world with detailed information and ratings
- **View Travel Packages**: Browse available travel packages with itineraries, pricing, and inclusions
- **Book Trips**: Easy-to-use booking form with validation and date selection
- **Manage Bookings**: View and manage your booking history in a personal dashboard
- **Responsive Design**: Fully responsive UI built with Angular Material

## Tech Stack

- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **UI Library**: Angular Material
- **Testing**: Vitest
- **State Management**: RxJS Observables
- **Data Storage**: LocalStorage for bookings

## Project Structure

```
src/
├── app/
│   ├── components/           # Angular components
│   │   ├── navbar/          # Navigation bar
│   │   ├── destination-list/# Destination listing
│   │   ├── package-detail/  # Package details view
│   │   ├── booking-form/    # Booking form with validation
│   │   └── user-dashboard/  # User bookings dashboard
│   ├── models/              # TypeScript interfaces
│   │   ├── destination.model.ts
│   │   ├── package.model.ts
│   │   ├── booking.model.ts
│   │   └── user.model.ts
│   ├── services/            # Angular services
│   │   ├── destination.ts   # Destination data service
│   │   ├── package.ts       # Package data service
│   │   └── booking.ts       # Booking management service
│   ├── app.routes.ts        # Application routing
│   └── app.config.ts        # App configuration
└── assets/
    └── data/                # Mock data (JSON)
        ├── destinations.json
        └── packages.json
```

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

## Application Features Detail

### Destination List
- Displays all available destinations with images and descriptions
- Shows popular activities for each destination
- Lists available packages with pricing
- Direct navigation to package details

### Package Detail
- Complete package information including itinerary
- Lists inclusions and exclusions
- Shows availability dates
- "Book Now" button for easy booking

### Booking Form
- Validates user input (name, email, phone)
- Date picker with availability constraints
- Number of travelers selection
- Special requests field
- Real-time price calculation
- Form validation feedback

### User Dashboard
- Displays all user bookings
- Shows booking status (Confirmed, Pending, Cancelled)
- Cancel booking functionality
- Booking details including travel date, travelers, and price

## Data Models

### Destination
- id, name, country
- description, imageUrl, rating
- popularActivities[]

### Package
- id, destinationId, name
- description, duration, price
- itinerary[], inclusions[], exclusions[]
- availableFrom, availableTo

### Booking
- id, userId, packageId
- packageName, destinationName
- numberOfTravelers, travelDate
- specialRequests, totalPrice
- bookingDate, status
- 
## 👤 Author

- Github: [Nihitha](https://github.com/Nihitha47)
- GitHub: [Darain](https://github.com/Darain-Brit-A)
- GitHub: [Praveen](https://github.com/2326praveen)
- GitHub: [Anush](https://github.com/anushjowin)

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
