import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  title = 'Travel Explorer';
  isMenuOpen = false;
  isScrolled = false;

  ngOnInit(): void {
    // Event binding for scroll
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  // Event binding - toggle mobile menu
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Event binding - close menu when link is clicked
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
