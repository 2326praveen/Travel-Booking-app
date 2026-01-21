import { Routes } from '@angular/router';
import { DestinationListComponent } from './components/destination-list/destination-list';
import { PackageDetailComponent } from './components/package-detail/package-detail';
import { BookingFormComponent } from './components/booking-form/booking-form';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/destinations', pathMatch: 'full' },
  { path: 'destinations', component: DestinationListComponent },
  { path: 'package/:id', component: PackageDetailComponent },
  { path: 'booking/:packageId', component: BookingFormComponent },
  { path: 'my-bookings', component: UserDashboardComponent }
];
