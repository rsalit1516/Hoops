import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { DivisionService } from './division.service';
import { UserActivityService, UserSessionData } from './user-activity.service';
import { LoggerService } from './logger.service';
import { User } from '../domain/user';
import { Division } from '../domain/division';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeUser(userId: number, userName: string, userType: number): User {
  const u = new User(userId, userName, userType === 2 || userType === 3);
  u.userType = userType;
  return u;
}

const MOCK_DIVISION: Division = {
  divisionId: 10,
  divisionDescription: 'Test Division',
  gender: 'M',
  gender2: 'M',
  seasonId: 1,
  minDate: undefined,
  maxDate: undefined,
  minDate2: undefined,
  maxDate2: undefined,
  directorId: null,
};

// ─────────────────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let mockStore: jasmine.SpyObj<Store<any>>;
  let mockUserActivityService: jasmine.SpyObj<UserActivityService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockDivisionService: { selectedDivision: ReturnType<typeof signal<Division | undefined>> };

  function buildMocks(): void {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'pipe', 'select']);
    mockUserActivityService = jasmine.createSpyObj('UserActivityService', [
      'loadUserSession',
      'saveUserSession',
      'clearUserSession',
      'recordActivity',
      'hasValidSession',
      'getSessionInfo',
    ]);
    mockLoggerService = jasmine.createSpyObj('LoggerService', [
      'info',
      'debug',
      'warn',
      'error',
    ]);
    mockDivisionService = {
      selectedDivision: signal<Division | undefined>(undefined),
    };
  }

  function configureTb(sessionData: UserSessionData | null): void {
    mockUserActivityService.loadUserSession.and.returnValue(sessionData);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Store, useValue: mockStore },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: UserActivityService, useValue: mockUserActivityService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: DataService, useValue: {} },
      ],
    });
  }

  // ── No stored session (HTTP-fallback path) ─────────────────────────────────

  describe('when no stored session (HTTP path)', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    const regularUser = makeUser(1, 'user1', 1);
    const adminUser = makeUser(2, 'admin', 2);
    const superAdminUser = makeUser(3, 'super', 3);

    beforeEach(() => {
      buildMocks();
      configureTb(null); // no localStorage session → HTTP fallback
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
      // Flush the automatic /api/auth/me request from initializeAuth()
      httpMock
        .expectOne((r) => r.url.includes('/api/auth/me'))
        .flush(null);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    // ── isLoggedIn ──────────────────────────────────────────────────────────

    describe('isLoggedIn', () => {
      it('returns false when no user is set', () => {
        expect(service.isLoggedIn()).toBeFalse();
      });

      it('returns true after a user is set', () => {
        service.currentUser.set(regularUser);
        expect(service.isLoggedIn()).toBeTrue();
      });
    });

    // ── isAdmin ─────────────────────────────────────────────────────────────

    describe('isAdmin', () => {
      it('returns false when no user', () => {
        expect(service.isAdmin()).toBeFalse();
      });

      it('returns false for userType 1 (regular user)', () => {
        service.currentUser.set(regularUser);
        expect(service.isAdmin()).toBeFalse();
      });

      it('returns true for userType 2 (admin)', () => {
        service.currentUser.set(adminUser);
        expect(service.isAdmin()).toBeTrue();
      });

      it('returns true for userType 3 (super-admin)', () => {
        service.currentUser.set(superAdminUser);
        expect(service.isAdmin()).toBeTrue();
      });
    });

    // ── canEditGames ────────────────────────────────────────────────────────

    describe('canEditGames', () => {
      it('returns false when no user', () => {
        mockDivisionService.selectedDivision.set(MOCK_DIVISION);
        expect(service.canEditGames()).toBeFalse();
      });

      it('returns false when no division selected', () => {
        service.currentUser.set(regularUser);
        mockDivisionService.selectedDivision.set(undefined);
        expect(service.canEditGames()).toBeFalse();
      });

      it('returns true for admin user regardless of division assignment', () => {
        service.currentUser.set(adminUser);
        mockDivisionService.selectedDivision.set(MOCK_DIVISION);
        expect(service.canEditGames()).toBeTrue();
      });

      it('returns false for non-admin user without a matching division', () => {
        const u = makeUser(1, 'u', 1);
        u.divisions = [{ ...MOCK_DIVISION, divisionId: 99 }];
        service.currentUser.set(u);
        mockDivisionService.selectedDivision.set(MOCK_DIVISION); // divisionId 10
        expect(service.canEditGames()).toBeFalse();
      });

      it('returns true for non-admin user with a matching division', () => {
        const u = makeUser(1, 'u', 1);
        u.divisions = [MOCK_DIVISION]; // divisionId 10
        service.currentUser.set(u);
        mockDivisionService.selectedDivision.set(MOCK_DIVISION);
        expect(service.canEditGames()).toBeTrue();
      });
    });

    // ── initializeAuth (HTTP path) ──────────────────────────────────────────

    describe('initializeAuth (HTTP path)', () => {
      it('leaves currentUser undefined when server returns null', () => {
        // The init request was flushed with null in beforeEach
        expect(service.currentUser()).toBeUndefined();
      });
    });

    // ── setUserState ────────────────────────────────────────────────────────

    describe('setUserState', () => {
      it('sets currentUser and dispatches a store action', () => {
        service.setUserState(regularUser);
        expect(service.currentUser()).toEqual(regularUser);
        expect(mockStore.dispatch).toHaveBeenCalled();
      });
    });

    // ── login ───────────────────────────────────────────────────────────────

    describe('login', () => {
      it('POSTs credentials and sets user state on success', () => {
        let result: User | undefined;
        service.login('user1', 'pass').subscribe((u) => (result = u));

        const req = httpMock.expectOne((r) =>
          r.url.includes('/api/auth/login'),
        );
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ userName: 'user1', password: 'pass' });
        req.flush(regularUser);

        expect(result).toEqual(regularUser);
        expect(service.currentUser()).toEqual(regularUser);
        expect(mockUserActivityService.recordActivity).toHaveBeenCalled();
      });

      it('propagates error on failed login', () => {
        let errorOccurred = false;
        service.login('bad', 'creds').subscribe({ error: () => (errorOccurred = true) });

        httpMock
          .expectOne((r) => r.url.includes('/api/auth/login'))
          .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(errorOccurred).toBeTrue();
      });
    });

    // ── logout ──────────────────────────────────────────────────────────────

    describe('logout', () => {
      it('clears user session after successful logout response', () => {
        service.currentUser.set(regularUser);
        service.logout();

        const req = httpMock.expectOne((r) =>
          r.url.includes('/api/auth/logout'),
        );
        expect(req.request.method).toBe('POST');
        req.flush({});

        expect(service.currentUser()).toBeUndefined();
        expect(mockUserActivityService.clearUserSession).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalled();
      });

      it('clears user session even when logout request errors', () => {
        service.currentUser.set(regularUser);
        service.logout();

        httpMock
          .expectOne((r) => r.url.includes('/api/auth/logout'))
          .error(new ProgressEvent('error'));

        expect(service.currentUser()).toBeUndefined();
        expect(mockUserActivityService.clearUserSession).toHaveBeenCalled();
      });
    });

    // ── logoutDueToInactivity ───────────────────────────────────────────────

    describe('logoutDueToInactivity', () => {
      it('clears the user session', () => {
        service.currentUser.set(regularUser);
        service.logoutDueToInactivity();
        expect(service.currentUser()).toBeUndefined();
        expect(mockUserActivityService.clearUserSession).toHaveBeenCalled();
      });
    });

    // ── delegation methods ──────────────────────────────────────────────────

    describe('getSessionInfo', () => {
      it('delegates to userActivityService', () => {
        const info = { timeRemaining: '19:00', isExpiringSoon: false };
        mockUserActivityService.getSessionInfo.and.returnValue(info);
        expect(service.getSessionInfo()).toEqual(info);
      });
    });

    describe('hasValidSession', () => {
      it('delegates to userActivityService', () => {
        mockUserActivityService.hasValidSession.and.returnValue(true);
        expect(service.hasValidSession()).toBeTrue();
      });
    });

    describe('recordActivity', () => {
      it('delegates to userActivityService', () => {
        service.recordActivity();
        expect(mockUserActivityService.recordActivity).toHaveBeenCalled();
      });
    });
  });

  // ── Stored session path (no HTTP call) ────────────────────────────────────

  describe('when a stored session exists (localStorage path)', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    const storedUser = makeUser(5, 'stored', 1);

    beforeEach(() => {
      buildMocks();
      const sessionData: UserSessionData = {
        user: storedUser,
        lastActivity: Date.now(),
        loginTime: Date.now(),
      };
      configureTb(sessionData);
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('restores user from localStorage without making an HTTP call', () => {
      httpMock.expectNone((r) => r.url.includes('/api/auth/me'));
      expect(service.currentUser()).toEqual(storedUser);
    });

    it('calls recordActivity to restart the inactivity timer', () => {
      expect(mockUserActivityService.recordActivity).toHaveBeenCalled();
    });
  });
});
