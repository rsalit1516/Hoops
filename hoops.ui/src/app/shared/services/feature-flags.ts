// src/app/services/feature-flag.service.ts
import { computed, Injectable, signal, resource, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { LoggerService } from '@app/services/logger.service';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private flagsSignal = signal<Record<string, boolean>>({});
  private logger = inject(LoggerService);

  // Enhanced computed signals for better reactivity
  readonly flags = computed(() => this.flagsSignal());
  readonly isLoaded = computed(
    () => Object.keys(this.flagsSignal()).length > 0
  );

  constructor(private http: HttpClient) {
    this.loadFlags();
  }

  loadFlags(): void {
    this.logger.info(
      'Loading feature flags from:',
      environment.featureFlagPath
    );
    this.logger.info('Environment object:', environment);
    this.http
      .get<Record<string, boolean>>(environment.featureFlagPath)
      .subscribe({
        next: (flags) => {
          this.logger.info('Feature flags loaded successfully:', flags);
          this.flagsSignal.set(flags);
        },
        error: (err) => {
          this.logger.error('Failed to load feature flags:', err);
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
