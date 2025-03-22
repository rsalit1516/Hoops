import { Injectable } from '@angular/core';
import { FEATURE_FLAGS } from '../shared/constants';

interface FeatureFlags {
  adminHouseholds: boolean;
  adminNotices: boolean;
  adminPeople: boolean;
  adminDirectors: boolean;
  adminColors: boolean;
  adminUsers: boolean;
  adminGames: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags: FeatureFlags = FEATURE_FLAGS
  isFeatureEnabled (feature: keyof FeatureFlags): boolean {
    return this.featureFlags[feature];
  }
}
