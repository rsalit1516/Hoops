import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { User } from '../domain/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Store } from '@ngrx/store';
import * as fromUser from '@app/user/state';
import * as userActions from '@app/user/state/user.actions';

import { Constants } from '../shared/constants';
import { DivisionService } from './division.service';
import { UserActivityService } from './user-activity.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly http = inject(HttpClient);
  readonly dataService = inject(DataService);
  readonly store = inject(Store<fromUser.State>);
  private divisionService = inject(DivisionService);
  private userActivityService = inject(UserActivityService);
  private logger = inject(LoggerService);

  // Enhanced signal definitions
  currentUser = signal<User | undefined>(undefined);

  // Computed signals - auto-update when dependencies change
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user ? user.userType === 2 || user.userType === 3 : false;
  });
  canEditGames = computed(() => {
    const user = this.currentUser();
    const divisionId = this.divisionService.selectedDivision()?.divisionId;

    if (!user || !divisionId) return false;

    // Admin users can edit all games
    if (user.userType === 2 || user.userType === 3) return true;

    // Check division-specific permissions
    return (
      user.divisions?.some((div) => div.divisionId === divisionId) ?? false
    );
  });

  redirectUrl: string | undefined;
  loginUrl: string | undefined;
  user: User | undefined;

  constructor() {
    this.initializeAuth();

    // Effect to save user session when currentUser changes
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.userActivityService.saveUserSession(user);
        this.logger.info('👤 User session saved for:', user.userName);
      }
    });
  }

  /**
   * Initialize authentication by checking localStorage first, then falling back to server
   */
  private initializeAuth(): void {
    // First, try to restore from localStorage (immediate)
    const sessionData = this.userActivityService.loadUserSession();
    if (sessionData) {
      this.logger.info('🔄 Restoring user session from localStorage');
      this.setUserState(sessionData.user);
      // Record activity to restart the timer
      this.userActivityService.recordActivity();
      return;
    }

    // Fall back to server authentication (cookie-based)
    this.logger.info('🌐 Checking server authentication...');
    this.http
      .get<User>(`${Constants.FUNCTIONS_BASE_URL}/api/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.logger.info('✅ Server authentication successful');
            this.setUserState(user);
          } else {
            this.logger.info('❌ No server authentication found');
          }
        }),
        catchError((error) => {
          this.logger.error('❌ Server authentication failed:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  login(userName: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${Constants.FUNCTIONS_BASE_URL}/api/auth/login`,
        { userName, password },
        { withCredentials: true }
      )
      .pipe(
        tap((user) => {
          if (user) {
            this.logger.info('🔐 Login successful for:', userName);
            this.setUserState(user);
            // Record login activity
            this.userActivityService.recordActivity();
          }
        }),
        catchError((error) => {
          this.logger.error('❌ Login failed:', error);
          throw error;
        })
      );
  }

  setUserState(user: User) {
    this.store.dispatch(new userActions.SetCurrentUser(user));
    this.currentUser.set(user);
    this.logger.info('👤 User state updated:', user.userName);
  }

  logout(): void {
    this.logger.info('🚪 Logging out user');

    this.http
      .post(
        `${Constants.FUNCTIONS_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        complete: () => {
          this.clearUserSession();
        },
        error: () => {
          this.clearUserSession();
        },
      });
  }

  /**
   * Clear user session both locally and from activity service
   */
  private clearUserSession(): void {
    this.currentUser.set(undefined);
    this.store.dispatch(new userActions.SetCurrentUser(undefined as any));
    this.userActivityService.clearUserSession();
    this.logger.info('🗑️ User session cleared');
  }

  /**
   * Force logout due to inactivity
   */
  logoutDueToInactivity(): void {
    this.logger.info('⏰ Logging out due to inactivity');
    this.clearUserSession();
    // Optionally, you could show a toast notification here
  }

  /**
   * Get session information for UI display
   */
  getSessionInfo() {
    return this.userActivityService.getSessionInfo();
  }

  /**
   * Check if user has a valid session
   */
  hasValidSession(): boolean {
    return this.userActivityService.hasValidSession();
  }

  /**
   * Manually record user activity (for API calls, etc.)
   */
  recordActivity(): void {
    this.userActivityService.recordActivity();
  }
}
