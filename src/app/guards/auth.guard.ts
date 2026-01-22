import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Authentication Guard
 * Protects routes that require user authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Mock authentication check
    // In a real application, this would check authentication status from an auth service
    const isAuthenticated = this.checkAuthentication();

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      return this.router.createUrlTree(['/'], {
        queryParams: { returnUrl: state.url }
      });
    }

    return true;
  }

  private checkAuthentication(): boolean {
    // Mock implementation - always returns true for demo
    // In production, check JWT token, session, etc.
    const token = localStorage.getItem('authToken');
    return token !== null;
  }
}

/**
 * Booking Guard
 * Ensures package is selected before accessing booking form
 */
@Injectable({
  providedIn: 'root'
})
export class BookingGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const packageId = route.paramMap.get('packageId');

    if (!packageId || isNaN(Number(packageId))) {
      return this.router.createUrlTree(['/']);
    }

    return true;
  }
}

/**
 * Admin Guard
 * Restricts access to admin-only routes
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRole = this.getUserRole();

    if (userRole !== 'admin') {
      return this.router.createUrlTree(['/']);
    }

    return true;
  }

  private getUserRole(): string {
    // Mock implementation
    return localStorage.getItem('userRole') || 'guest';
  }
}
