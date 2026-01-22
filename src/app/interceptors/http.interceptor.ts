import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpEventType
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, finalize, retry, timeout } from 'rxjs/operators';

/**
 * HTTP Interceptor for adding headers, handling errors, and logging
 */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private requestCount = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.requestCount++;
    const startTime = Date.now();

    // Clone the request and add authorization header
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'X-Request-ID': this.generateRequestId(),
        'X-Client-Version': '1.0.0'
      }
    });

    console.log(`[HTTP] ${modifiedRequest.method} ${modifiedRequest.url}`);

    return next.handle(modifiedRequest).pipe(
      timeout(30000), // 30 second timeout
      retry(2), // Retry failed requests twice
      tap(event => {
        if (event.type === HttpEventType.Response) {
          const duration = Date.now() - startTime;
          console.log(`[HTTP] Response received in ${duration}ms:`, event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, modifiedRequest);
      }),
      finalize(() => {
        this.requestCount--;
        console.log(`[HTTP] Active requests: ${this.requestCount}`);
      })
    );
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<unknown>): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error (${error.status}): ${error.message}`;
      
      // Handle specific status codes
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          // Could trigger logout here
          break;
        case 403:
          errorMessage = 'Access forbidden.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
      }
    }

    console.error(`[HTTP Error] ${request.method} ${request.url}:`, errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

/**
 * Caching Interceptor for GET requests
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<unknown>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    
    if (cachedResponse) {
      console.log(`[Cache] Returning cached response for ${request.url}`);
      return of(cachedResponse.clone());
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`[Cache] Caching response for ${request.url}`);
          this.cache.set(request.url, event.clone());
          
          // Clear cache after duration
          setTimeout(() => {
            this.cache.delete(request.url);
            console.log(`[Cache] Expired cache for ${request.url}`);
          }, this.CACHE_DURATION);
        }
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[Cache] Cache cleared');
  }
}

/**
 * Loading Interceptor to track loading state
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    this.updateLoadingState(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.updateLoadingState(false);
        }
      })
    );
  }

  private updateLoadingState(isLoading: boolean): void {
    // Could dispatch to a loading service or state management
    console.log(`[Loading] ${isLoading ? 'Started' : 'Finished'} (Active: ${this.activeRequests})`);
  }
}
