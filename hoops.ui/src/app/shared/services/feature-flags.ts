// src/app/services/feature-flag.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private flagsSignal = signal<Record<string, boolean>>({});

  constructor(private http: HttpClient) {
    this.loadFlags();
  }

  loadFlags(): void {
    this.http
      .get<Record<string, boolean>>(environment.featureFlagPath)
      .subscribe((flags) => this.flagsSignal.set(flags));
  }

  isEnabled(flag: string): boolean {
    return this.flagsSignal()[flag] ?? false;
  }

  readonly flags = computed(() => this.flagsSignal());
}
