// src/app/services/feature-flag.service.ts
import { computed, Injectable, signal, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private flagsSignal = signal<Record<string, boolean>>({});

  // Enhanced computed signals for better reactivity
  readonly flags = computed(() => this.flagsSignal());
  readonly isLoaded = computed(
    () => Object.keys(this.flagsSignal()).length > 0
  );

  constructor(private http: HttpClient) {
    this.loadFlags();
  }

  loadFlags(): void {
    console.log(
      '🔥 DIRECT: Loading feature flags from:',
      environment.featureFlagPath
    );
    console.log('🔥 DIRECT: Environment object:', environment);
    this.http
      .get<Record<string, boolean>>(environment.featureFlagPath)
      .subscribe({
        next: (flags) => {
          console.log('🔥 DIRECT: Feature flags loaded successfully:', flags);
          this.flagsSignal.set(flags);
        },
        error: (err) => {
          console.error('🔥 DIRECT: Failed to load feature flags:', err);
          this.flagsSignal.set({});
        },
      });
  }

  isEnabled(flag: string): boolean {
    return this.flagsSignal()[flag] ?? false;
  }

  // Enhanced method that returns a computed signal for a specific flag
  getFlag(flag: string) {
    return computed(() => this.flagsSignal()[flag] ?? false);
  }
}
