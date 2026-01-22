import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Booking, Destination, Package, User } from '../models';

/**
 * Application State Interface
 */
export interface AppState {
  user: User | null;
  selectedDestination: Destination | null;
  selectedPackage: Package | null;
  cart: Booking[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: FilterState;
}

/**
 * Filter State Interface
 */
export interface FilterState {
  priceRange: { min: number; max: number };
  rating: number;
  duration: { min: number; max: number };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Default application state
 */
const initialState: AppState = {
  user: null,
  selectedDestination: null,
  selectedPackage: null,
  cart: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  filters: {
    priceRange: { min: 0, max: 1000000 },
    rating: 0,
    duration: { min: 1, max: 30 },
    sortBy: 'name',
    sortOrder: 'asc'
  }
};

/**
 * State Management Service
 * Centralized state management for the application
 */
@Injectable({
  providedIn: 'root'
})
export class StateManagementService {
  private readonly state$ = new BehaviorSubject<AppState>(initialState);
  private readonly actions$ = new Subject<Action>();

  /**
   * Get the current state
   */
  getState(): AppState {
    return this.state$.value;
  }

  /**
   * Get state as observable
   */
  getState$(): Observable<AppState> {
    return this.state$.asObservable();
  }

  /**
   * Select a specific part of the state
   */
  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return this.state$.pipe(
      map(state => state[key]),
      distinctUntilChanged()
    );
  }

  /**
   * Update state
   */
  setState(partialState: Partial<AppState>): void {
    const currentState = this.state$.value;
    const newState = { ...currentState, ...partialState };
    this.state$.next(newState);
  }

  /**
   * Reset state to initial values
   */
  resetState(): void {
    this.state$.next(initialState);
  }

  /**
   * User state methods
   */
  setUser(user: User | null): void {
    this.setState({ user });
  }

  getUser$(): Observable<User | null> {
    return this.select('user');
  }

  /**
   * Destination state methods
   */
  setSelectedDestination(destination: Destination | null): void {
    this.setState({ selectedDestination: destination });
  }

  getSelectedDestination$(): Observable<Destination | null> {
    return this.select('selectedDestination');
  }

  /**
   * Package state methods
   */
  setSelectedPackage(pkg: Package | null): void {
    this.setState({ selectedPackage: pkg });
  }

  getSelectedPackage$(): Observable<Package | null> {
    return this.select('selectedPackage');
  }

  /**
   * Cart state methods
   */
  addToCart(booking: Booking): void {
    const currentCart = this.state$.value.cart;
    this.setState({ cart: [...currentCart, booking] });
  }

  removeFromCart(bookingId: number): void {
    const currentCart = this.state$.value.cart;
    const updatedCart = currentCart.filter(b => b.id !== bookingId);
    this.setState({ cart: updatedCart });
  }

  clearCart(): void {
    this.setState({ cart: [] });
  }

  getCart$(): Observable<Booking[]> {
    return this.select('cart');
  }

  getCartCount$(): Observable<number> {
    return this.getCart$().pipe(map(cart => cart.length));
  }

  /**
   * Loading state methods
   */
  setLoading(isLoading: boolean): void {
    this.setState({ isLoading });
  }

  getLoading$(): Observable<boolean> {
    return this.select('isLoading');
  }

  /**
   * Error state methods
   */
  setError(error: string | null): void {
    this.setState({ error });
  }

  clearError(): void {
    this.setState({ error: null });
  }

  getError$(): Observable<string | null> {
    return this.select('error');
  }

  /**
   * Search state methods
   */
  setSearchTerm(searchTerm: string): void {
    this.setState({ searchTerm });
  }

  getSearchTerm$(): Observable<string> {
    return this.select('searchTerm');
  }

  /**
   * Filter state methods
   */
  setFilters(filters: Partial<FilterState>): void {
    const currentFilters = this.state$.value.filters;
    const newFilters = { ...currentFilters, ...filters };
    this.setState({ filters: newFilters });
  }

  resetFilters(): void {
    this.setState({ filters: initialState.filters });
  }

  getFilters$(): Observable<FilterState> {
    return this.select('filters');
  }

  /**
   * Action dispatcher
   */
  dispatch(action: Action): void {
    this.actions$.next(action);
    this.handleAction(action);
  }

  /**
   * Action observer
   */
  getActions$(): Observable<Action> {
    return this.actions$.asObservable();
  }

  /**
   * Handle dispatched actions
   */
  private handleAction(action: Action): void {
    switch (action.type) {
      case 'LOGIN':
        this.setUser(action.payload as User);
        break;
      case 'LOGOUT':
        this.setUser(null);
        this.clearCart();
        break;
      case 'SELECT_DESTINATION':
        this.setSelectedDestination(action.payload as Destination);
        break;
      case 'SELECT_PACKAGE':
        this.setSelectedPackage(action.payload as Package);
        break;
      case 'ADD_TO_CART':
        this.addToCart(action.payload as Booking);
        break;
      case 'CLEAR_CART':
        this.clearCart();
        break;
      case 'SET_LOADING':
        this.setLoading(action.payload as boolean);
        break;
      case 'SET_ERROR':
        this.setError(action.payload as string);
        break;
      case 'CLEAR_ERROR':
        this.clearError();
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }
}

/**
 * Action interface for state management
 */
export interface Action {
  type: string;
  payload?: unknown;
}

/**
 * Action creators
 */
export class Actions {
  static login(user: User): Action {
    return { type: 'LOGIN', payload: user };
  }

  static logout(): Action {
    return { type: 'LOGOUT' };
  }

  static selectDestination(destination: Destination): Action {
    return { type: 'SELECT_DESTINATION', payload: destination };
  }

  static selectPackage(pkg: Package): Action {
    return { type: 'SELECT_PACKAGE', payload: pkg };
  }

  static addToCart(booking: Booking): Action {
    return { type: 'ADD_TO_CART', payload: booking };
  }

  static clearCart(): Action {
    return { type: 'CLEAR_CART' };
  }

  static setLoading(isLoading: boolean): Action {
    return { type: 'SET_LOADING', payload: isLoading };
  }

  static setError(error: string): Action {
    return { type: 'SET_ERROR', payload: error };
  }

  static clearError(): Action {
    return { type: 'CLEAR_ERROR' };
  }
}
