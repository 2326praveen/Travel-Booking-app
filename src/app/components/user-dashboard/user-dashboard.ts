import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../services/booking';
import { Booking, BookingStatus, ViewMode } from '../../models';

type FilterStatus = 'all' | BookingStatus;
type SortByType = 'date' | 'price' | 'status';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboardComponent implements OnInit {
  bookings: readonly Booking[] = [];
  filteredBookings: Booking[] = [];
  filterStatus: FilterStatus = 'all';
  sortBy: SortByType = 'date';
  viewMode: ViewMode = 'grid';
  selectedBookingId: number | null = null;
  
  // Expose enum to template
  readonly BookingStatus = BookingStatus;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe(bookings => {
      this.bookings = bookings;
      this.applyFilters();
    });
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        this.snackBar.open('Booking cancelled successfully', 'Close', {
          duration: 3000
        });
        this.loadBookings();
      });
    }
  }

  // Event binding - filter by status
  onFilterStatus(status: string): void {
    this.filterStatus = status as FilterStatus;
    this.applyFilters();
  }

  // Event binding - sort bookings
  onSort(sortBy: 'date' | 'price' | 'status'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  // Event binding - toggle view mode
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Event binding - select booking
  selectBooking(bookingId: number): void {
    this.selectedBookingId = this.selectedBookingId === bookingId ? null : bookingId;
  }

  // Apply filters and sorting
  private applyFilters(): void {
    let filtered = [...this.bookings];

    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === this.filterStatus);
    }

    // Sort bookings
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.travelDate).getTime() - new Date(a.travelDate).getTime();
        case 'price':
          return b.totalPrice - a.totalPrice;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    this.filteredBookings = filtered;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  // Helper for ngStyle
  getStatusBadgeStyle(status: string): any {
    switch (status) {
      case 'confirmed':
        return { 'background-color': '#4caf50', 'color': 'white' };
      case 'pending':
        return { 'background-color': '#ff9800', 'color': 'white' };
      case 'cancelled':
        return { 'background-color': '#f44336', 'color': 'white' };
      default:
        return { 'background-color': '#999', 'color': 'white' };
    }
  }

  // Helper for ngClass
  isPastBooking(travelDate: Date): boolean {
    return new Date(travelDate) < new Date();
  }
}
