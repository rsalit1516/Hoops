import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { adminGuard } from './admin-guard.guard';
import { FeatureFlagService } from '../services/feature-flags';

describe('adminGuard', () => {
  function runGuardWith(flagEnabled: boolean) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FeatureFlagService,
          useValue: { isEnabled: () => flagEnabled },
        },
      ],
    });
    const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => adminGuard(...guardParameters));
    return executeGuard({} as any, {} as any);
  }

  it('allows when adminModule flag enabled', () => {
    const result = runGuardWith(true);
    expect(result).toBeTrue();
  });

  it('blocks when adminModule flag disabled', () => {
    const result = runGuardWith(false);
    expect(result).toBeFalse();
  });
});
