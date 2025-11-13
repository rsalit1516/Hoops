import { Injectable, inject, signal, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoggerService } from './logger.service';
import { filter } from 'rxjs/operators';

export interface UserSessionData {
  user: any;
  lastActivity: number;
  loginTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);

  // Session timeout in milliseconds (20 minutes)
  private readonly SESSION_TIMEOUT = 20 * 60 * 1000;
  private readonly STORAGE_KEY = 'hoops_user_session';

  // Signals for tracking activity
  lastActivity = signal<number>(Date.now());
  isActive = signal<boolean>(true);

  // Activity tracking state
  private activityTimer: number | null = null;
  private inactivityTimer: number | null = null;

  constructor() {
    this.initializeActivityTracking();
    this.trackRouterNavigation();

    // Effect to handle activity changes
    effect(() => {
      const activity = this.lastActivity();
      // this.logger.info(
      //   '🎯 User activity updated:',
      //   new Date(activity).toLocaleTimeString()
      // );
      this.resetInactivityTimer();
    });
  }

  /**
   * Initialize activity tracking with DOM event listeners
   */
  private initializeActivityTracking(): void {
    if (typeof document !== 'undefined') {
      // Track various user interactions
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
      ];

      events.forEach((event) => {
        document.addEventListener(event, () => this.recordActivity(), {
          passive: true,
        });
      });

      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.recordActivity();
        }
      });
    }
  }

  /**
   * Track router navigation as user activity
   */
  private trackRouterNavigation(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.recordActivity();
      });
  }

  /**
   * Record user activity and update timestamp
   */
  recordActivity(): void {
    const now = Date.now();
    this.lastActivity.set(now);
    this.isActive.set(true);
  }

  /**
   * Reset the inactivity timer
   */
  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = window.setTimeout(() => {
      this.isActive.set(false);
      this.logger.info('🔴 User became inactive after 20 minutes');
      this.clearUserSession();
    }, this.SESSION_TIMEOUT);
  }

  /**
   * Save user session data to localStorage
   */
  saveUserSession(user: any): void {
    try {
      const sessionData: UserSessionData = {
        user,
        lastActivity: this.lastActivity(),
        loginTime: Date.now(),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      this.logger.info('💾 User session saved to localStorage');
    } catch (error) {
      this.logger.error('❌ Failed to save user session:', error);
    }
  }

  /**
   * Load user session data from localStorage
   */
  loadUserSession(): UserSessionData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const sessionData: UserSessionData = JSON.parse(stored);
      const now = Date.now();
      const timeSinceLastActivity = now - sessionData.lastActivity;

      // Check if session has expired
      if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
        this.logger.info('⏰ User session expired, clearing localStorage');
        this.clearUserSession();
        return null;
      }

      // Update activity timestamp to current time
      this.lastActivity.set(now);
      this.logger.info('✅ Valid user session loaded from localStorage');
      return sessionData;
    } catch (error) {
      this.logger.error('❌ Failed to load user session:', error);
      this.clearUserSession();
      return null;
    }
  }

  /**
   * Clear user session data from localStorage
   */
  clearUserSession(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.logger.info('🗑️ User session cleared from localStorage');
    } catch (error) {
      this.logger.error('❌ Failed to clear user session:', error);
    }
  }

  /**
   * Check if a session exists and is valid
   */
  hasValidSession(): boolean {
    return this.loadUserSession() !== null;
  }

  /**
   * Get time remaining until session expires (in milliseconds)
   */
  getTimeUntilExpiry(): number {
    const sessionData = this.loadUserSession();
    if (!sessionData) {
      return 0;
    }

    const timeSinceLastActivity = Date.now() - sessionData.lastActivity;
    return Math.max(0, this.SESSION_TIMEOUT - timeSinceLastActivity);
  }

  /**
   * Get session duration in a human-readable format
   */
  getSessionInfo(): { timeRemaining: string; isExpiringSoon: boolean } {
    const timeRemaining = this.getTimeUntilExpiry();
    const minutes = Math.floor(timeRemaining / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return {
      timeRemaining: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      isExpiringSoon: timeRemaining < 5 * 60 * 1000, // Less than 5 minutes
    };
  }

  /**
   * Cleanup method to be called when service is destroyed
   */
  cleanup(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
  }
}
