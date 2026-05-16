import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sponsor } from '@app/domain/sponsor';
import { Constants } from '@app/shared/constants';
import { LoggerService } from '@app/services/logger.service';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);

  readonly sponsors = signal<Sponsor[]>([]);
  readonly isLoading = signal(false);

  load(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.http.get<Sponsor[]>(Constants.GET_CURRENT_SPONSORS).subscribe({
      next: (data) => {
        this.sponsors.set(data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.logger.error('Failed to load sponsors', err);
        this.isLoading.set(false);
      },
    });
  }
}
