// src/app/services/feature-flag.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private flagsSignal = signal<Record<string, boolean>>({});

  constructor(private http: HttpClient) {
    this.loadFlags();
  }

  loadFlags(): void {
    console.log(
      '� DIRECT: Loading feature flags from:',
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

  readonly flags = computed(() => this.flagsSignal());
}
