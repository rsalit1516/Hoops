import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';

class AuthServiceMock {
  private loggedIn = false;
  setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthServiceMock;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    navigateSpy = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useValue: { navigate: navigateSpy } },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as unknown as AuthServiceMock;
  });

  it('should allow activation when logged in', () => {
    authService.setLoggedIn(true);
    const result = guard.canActivate({} as any, { url: '/home' } as any);
    expect(result).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should redirect to login with returnUrl when not logged in', () => {
    authService.setLoggedIn(false);
    const result = guard.canActivate({} as any, { url: '/secure/page?x=1' } as any);
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/secure/page?x=1' },
      replaceUrl: true,
    });
  });

  it('should allow load when logged in', () => {
    authService.setLoggedIn(true);
    const result = guard.canLoad({} as any, []);
    expect(result).toBeTrue();
  });

  it('should block load when not logged in', () => {
    authService.setLoggedIn(false);
    const result = guard.canLoad({} as any, []);
    expect(result).toBeFalse();
  });
});
