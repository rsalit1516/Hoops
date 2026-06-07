import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { DataService } from '@app/services/data.service';
import { LoggerService } from '@app/services/logger.service';
import {
  SponsorProfile,
  SponsorSeason,
  SponsorPayment,
  SponsorFee,
} from '@app/domain/sponsor-profile';

const SPONSOR_FEES: SponsorFee[] = [
  { sponsorFeeId: 1, feeName: 'Standard',    amount: 225.00 },
  { sponsorFeeId: 2, feeName: 'Discount',    amount: 112.50 },
  { sponsorFeeId: 3, feeName: 'Scholarship', amount: 0 },
];

@Injectable({ providedIn: 'root' })
export class AdminSponsorService {
  private http = inject(HttpClient);
  private dataService = inject(DataService);
  private logger = inject(LoggerService);

  readonly profileDetail = signal<SponsorProfile | null>(null);
  readonly seasons = signal<SponsorSeason[]>([]);
  readonly payments = signal<SponsorPayment[]>([]);
  readonly fees = signal<SponsorFee[]>([]);
  readonly isLoadingProfile = signal(false);
  readonly isLoadingSeasons = signal(false);
  readonly isLoadingPayments = signal(false);

  loadProfile(id: number): void {
    this.isLoadingProfile.set(true);
    this.http
      .get<SponsorProfile>(`${Constants.GET_SPONSOR_PROFILE_BY_ID_URL}/${id}`, { withCredentials: true })
      .subscribe({
        next: (profile) => {
          this.profileDetail.set(profile);
          this.isLoadingProfile.set(false);
        },
        error: (err) => {
          this.logger.error('Failed to load sponsor profile', err);
          this.isLoadingProfile.set(false);
        },
      });
  }

  saveProfile(profile: SponsorProfile): Observable<SponsorProfile> {
    const isNew = !profile.sponsorProfileId || profile.sponsorProfileId === 0;
    const request = isNew
      ? this.http.post<SponsorProfile>(Constants.POST_SPONSOR_PROFILE_URL, profile, { withCredentials: true })
      : this.http.put<SponsorProfile>(`${Constants.PUT_SPONSOR_PROFILE_URL}/${profile.sponsorProfileId}`, profile, { withCredentials: true });

    return request.pipe(
      tap((saved) => {
        this.profileDetail.set(saved);
        this.logger.info('Saved sponsor profile', saved);
      }),
      catchError(this.dataService.handleError<SponsorProfile>('saveProfile'))
    );
  }

  loadSeasons(sponsorProfileId: number): void {
    this.isLoadingSeasons.set(true);
    this.http
      .get<SponsorSeason[]>(`${Constants.GET_SPONSOR_BY_PROFILE_URL}/${sponsorProfileId}`, { withCredentials: true })
      .subscribe({
        next: (seasons) => {
          this.seasons.set(seasons ?? []);
          this.isLoadingSeasons.set(false);
        },
        error: (err) => {
          this.logger.error('Failed to load sponsor seasons', err);
          this.isLoadingSeasons.set(false);
        },
      });
  }

  saveSeasonEntry(entry: SponsorSeason): Observable<SponsorSeason> {
    const isNew = !entry.sponsorId || entry.sponsorId === 0;
    const request = isNew
      ? this.http.post<SponsorSeason>(Constants.POST_SPONSOR_URL, entry, { withCredentials: true })
      : this.http.put<SponsorSeason>(`${Constants.PUT_SPONSOR_URL}/${entry.sponsorId}`, entry, { withCredentials: true });

    return request.pipe(
      tap((saved) => {
        this.seasons.update((current) => {
          const idx = current.findIndex((s) => s.sponsorId === saved.sponsorId);
          return idx >= 0 ? current.map((s, i) => (i === idx ? saved : s)) : [...current, saved];
        });
        this.logger.info('Saved season entry', saved);
      }),
      catchError(this.dataService.handleError<SponsorSeason>('saveSeasonEntry'))
    );
  }

  loadPayments(sponsorProfileId: number): void {
    this.isLoadingPayments.set(true);
    this.http
      .get<SponsorPayment[]>(`${Constants.GET_SPONSOR_PAYMENTS_URL}/${sponsorProfileId}`, { withCredentials: true })
      .subscribe({
        next: (payments) => {
          this.payments.set(payments ?? []);
          this.isLoadingPayments.set(false);
        },
        error: (err) => {
          this.logger.error('Failed to load sponsor payments', err);
          this.isLoadingPayments.set(false);
        },
      });
  }

  savePayment(payment: SponsorPayment): Observable<SponsorPayment> {
    const isNew = !payment.paymentId || payment.paymentId === 0;
    const request = isNew
      ? this.http.post<SponsorPayment>(Constants.POST_SPONSOR_PAYMENT_URL, payment, { withCredentials: true })
      : this.http.put<SponsorPayment>(`${Constants.PUT_SPONSOR_PAYMENT_URL}/${payment.paymentId}`, payment, { withCredentials: true });

    return request.pipe(
      tap((saved) => {
        this.payments.update((current) => {
          const idx = current.findIndex((p) => p.paymentId === saved.paymentId);
          return idx >= 0 ? current.map((p, i) => (i === idx ? saved : p)) : [saved, ...current];
        });
        this.logger.info('Saved payment', saved);
      }),
      catchError(this.dataService.handleError<SponsorPayment>('savePayment'))
    );
  }

  loadFees(): void {
    if (this.fees().length > 0) return;
    this.fees.set(SPONSOR_FEES);
  }

  clearDetail(): void {
    this.profileDetail.set(null);
    this.seasons.set([]);
    this.payments.set([]);
  }
}
