import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { FeatureFlagService } from './../services/feature-flags';
export const adminGuard: CanActivateFn = () => {
  const featureFlags = inject(FeatureFlagService);
  return featureFlags.isEnabled('adminModule');
};
