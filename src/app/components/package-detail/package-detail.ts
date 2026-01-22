import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PackageService } from '../../services/package';
import { DestinationService } from '../../services/destination';
import { Package, Destination, PriceCategory, getPriceCategory } from '../../models';

type SectionType = 'itinerary' | 'inclusions' | 'exclusions';

@Component({
  selector: 'app-package-detail',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './package-detail.html',
  styleUrl: './package-detail.css',
})
export class PackageDetailComponent implements OnInit {
  package: Package | null = null;
  destination: Destination | null = null;
  isFavorite: boolean = false;
  selectedImage: string = '';
  showItinerary: boolean = true;
  showInclusions: boolean = true;
  showExclusions: boolean = true;
  readonly imageGallery: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.packageService.getPackageById(id).subscribe(pkg => {
      this.package = pkg;
      if (pkg) {
        this.selectedImage = pkg.imageUrl;
        // Mock additional images for gallery
        (this.imageGallery as string[]).push(
          pkg.imageUrl,
          pkg.imageUrl.replace('?w=800', '?w=800&h=600&fit=crop&auto=format'),
          pkg.imageUrl.replace('?w=800', '?w=800&h=600&fit=crop&auto=format&crop=top')
        );
        this.destinationService.getDestinationById(pkg.destinationId).subscribe(dest => {
          this.destination = dest;
        });
      }
    });
  }

  bookNow(): void {
    if (this.package) {
      this.router.navigate(['/booking', this.package.id]);
    }
  }

  // Event binding - toggle favorite
  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  // Event binding - change selected image
  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  // Event binding - toggle sections
  toggleSection(section: SectionType): void {
    switch (section) {
      case 'itinerary':
        this.showItinerary = !this.showItinerary;
        break;
      case 'inclusions':
        this.showInclusions = !this.showInclusions;
        break;
      case 'exclusions':
        this.showExclusions = !this.showExclusions;
        break;
    }
  }

  // Helper for ngStyle
  getAvailabilityColor(): string {
    if (!this.package) return '#666';
    const availableFrom = new Date(this.package.availableFrom);
    const today = new Date();
    const daysUntilAvailable = Math.ceil((availableFrom.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilAvailable <= 7) return '#4caf50';
    if (daysUntilAvailable <= 30) return '#ff9800';
    return '#2196f3';
  }

  // Helper for ngClass
  getPriceCategory(): PriceCategory | '' {
    if (!this.package) return '';
    return getPriceCategory(this.package.price);
  }
}
