import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DestinationService } from '../../services/destination';
import { PackageService } from '../../services/package';
import { Destination, Package } from '../../models';

@Component({
  selector: 'app-destination-list',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './destination-list.html',
  styleUrl: './destination-list.css',
})
export class DestinationListComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  packages: Package[] = [];
  searchTerm: string = '';
  selectedRating: number = 0;
  sortBy: 'name' | 'rating' | 'country' = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  hoveredCardId: number | null = null;

  constructor(
    private destinationService: DestinationService,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe(destinations => {
      this.destinations = destinations;
      this.filteredDestinations = destinations;
    });
    
    this.packageService.getPackages().subscribe(packages => {
      this.packages = packages;
    });
  }

  getPackagesForDestination(destinationId: number): Package[] {
    return this.packages.filter(p => p.destinationId === destinationId);
  }

  // Event binding - search functionality
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  // Event binding - filter by rating
  filterByRating(rating: number): void {
    this.selectedRating = rating;
    this.applyFilters();
  }

  // Event binding - sort destinations
  onSort(sortBy: 'name' | 'rating' | 'country'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  // Event binding - toggle view mode
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Event binding - card hover
  onCardHover(destinationId: number | null): void {
    this.hoveredCardId = destinationId;
  }

  // Apply all filters and sorting
  private applyFilters(): void {
    let filtered = [...this.destinations];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(term) || 
        d.country.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term)
      );
    }

    // Filter by rating
    if (this.selectedRating > 0) {
      filtered = filtered.filter(d => d.rating >= this.selectedRating);
    }

    // Sort destinations
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'country':
          return a.country.localeCompare(b.country);
        default:
          return 0;
      }
    });

    this.filteredDestinations = filtered;
  }

  // Helper method for ngClass
  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Helper method for ngStyle
  getCardElevation(destinationId: number): string {
    return this.hoveredCardId === destinationId ? '12px' : '4px';
  }
}
