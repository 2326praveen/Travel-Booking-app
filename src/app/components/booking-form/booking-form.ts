import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PackageService } from '../../services/package';
import { BookingService } from '../../services/booking';
import { Package, Booking } from '../../models';

@Component({
  selector: 'app-booking-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  package: Package | null = null;
  minDate = new Date();
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const packageId = Number(this.route.snapshot.paramMap.get('packageId'));
    
    this.packageService.getPackageById(packageId).subscribe(pkg => {
      this.package = pkg || null;
      if (pkg) {
        const availableFrom = new Date(pkg.availableFrom);
        const availableTo = new Date(pkg.availableTo);
        this.minDate = availableFrom > this.minDate ? availableFrom : this.minDate;
        this.maxDate = availableTo;
      }
    });

    this.bookingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      numberOfTravelers: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      travelDate: ['', Validators.required],
      specialRequests: ['']
    });
  }

  get totalPrice(): number {
    if (!this.package) return 0;
    const travelers = this.bookingForm.get('numberOfTravelers')?.value || 1;
    return this.package.price * travelers;
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.package) {
      const formValue = this.bookingForm.value;
      const booking: Booking = {
        id: Date.now(),
        userId: 1, // Mock user ID
        packageId: this.package.id,
        packageName: this.package.name,
        destinationName: '', // Will be set by service
        numberOfTravelers: formValue.numberOfTravelers,
        travelDate: formValue.travelDate,
        specialRequests: formValue.specialRequests,
        totalPrice: this.totalPrice,
        bookingDate: new Date(),
        status: 'confirmed'
      };

      this.bookingService.createBooking(booking).subscribe(() => {
        this.snackBar.open('Booking confirmed successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/my-bookings']);
      });
    }
  }
}
