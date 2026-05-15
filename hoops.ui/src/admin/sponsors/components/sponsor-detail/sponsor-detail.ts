import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { AdminSponsorService } from '../../admin-sponsor.service';
import { SponsorSeason, SponsorPayment } from '@app/domain/sponsor-profile';
import { SeasonService } from '@app/services/season.service';
import { LoggerService } from '@app/services/logger.service';

interface ProfileFormModel {
  spoName: string;
  contactName: string;
  email: string;
  phone: string;
  url: string;
  address: string;
  city: string;
  stateAbbr: string;
  zip: string;
  typeOfBuss: string;
  showAd: boolean;
  adExpiration: Date | string | null;
}

interface SeasonFormModel {
  shirtName: string;
  shirtSize: string;
  spoAmount: number | null;
  feeId: number | null;
  mailCheck: boolean;
}

interface PaymentFormModel {
  amount: number | null;
  paymentType: string;
  transactionDate: Date | string | null;
  transactionNumber: string;
  memo: string;
}

const BLANK_PROFILE: { state: string; spoName: string; contactName: string; email: string; phone: string; url: string; address: string; city: string; zip: string; typeOfBuss: string; showAd: boolean; adExpiration: Date | string | null } = {
  spoName: '', contactName: '', email: '', phone: '', url: '',
  address: '', city: '', state: '', zip: '', typeOfBuss: '', showAd: false, adExpiration: null,
};

const BLANK_SEASON: SeasonFormModel = {
  shirtName: '', shirtSize: '', spoAmount: null, feeId: null, mailCheck: false,
};

const BLANK_PAYMENT: PaymentFormModel = {
  amount: null, paymentType: '', transactionDate: null, transactionNumber: '', memo: '',
};

@Component({
  selector: 'sponsor-detail',
  standalone: true,
  imports: [
    FormField,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './sponsor-detail.html',
  styleUrls: [
    './sponsor-detail.scss',
    '../../../admin.scss',
    '../../../../shared/scss/forms.scss',
    '../../../../shared/scss/cards.scss',
  ],
  providers: [provideNativeDateAdapter()],
})
export class SponsorDetail {
  readonly sponsorProfileId = input<number | null>(null);
  readonly isNew = input(false);
  readonly closed = output<void>();

  private readonly sponsorService = inject(AdminSponsorService);
  private readonly seasonService = inject(SeasonService);
  private readonly logger = inject(LoggerService);

  // ── Profile form ────────────────────────────────────────────────────────────
  readonly profileModel = signal<ProfileFormModel>({
    spoName: '', contactName: '', email: '', phone: '', url: '',
    address: '', city: '', stateAbbr: '', zip: '', typeOfBuss: '', showAd: false, adExpiration: null,
  });
  readonly profileForm = form(this.profileModel);

  readonly isProfileValid = computed(() =>
    !!this.profileForm.spoName().value()?.trim() &&
    !!this.profileForm.contactName().value()?.trim()
  );

  readonly isProfileDirty = computed(() =>
    this.profileForm.spoName().dirty() ||
    this.profileForm.contactName().dirty() ||
    this.profileForm.email().dirty() ||
    this.profileForm.phone().dirty() ||
    this.profileForm.url().dirty() ||
    this.profileForm.address().dirty() ||
    this.profileForm.city().dirty() ||
    this.profileForm.stateAbbr().dirty() ||
    this.profileForm.zip().dirty() ||
    this.profileForm.typeOfBuss().dirty() ||
    this.profileForm.showAd().dirty() ||
    this.profileForm.adExpiration().dirty()
  );

  readonly canSaveProfile = computed(() =>
    this.isNew() ? this.isProfileValid() : (this.isProfileDirty() && this.isProfileValid())
  );

  // ── Season add form ──────────────────────────────────────────────────────────
  readonly showSeasonForm = signal(false);
  readonly seasonFormModel = signal<SeasonFormModel>({ ...BLANK_SEASON });
  readonly seasonForm = form(this.seasonFormModel);
  readonly savingSeasonEntry = signal(false);

  // ── Payment add form ─────────────────────────────────────────────────────────
  readonly showPaymentForm = signal(false);
  readonly paymentFormModel = signal<PaymentFormModel>({ ...BLANK_PAYMENT });
  readonly paymentForm = form(this.paymentFormModel);
  readonly savingPayment = signal(false);

  readonly canSavePayment = computed(() =>
    (this.paymentForm.amount().value() ?? 0) > 0
  );

  // ── Service data pass-throughs ────────────────────────────────────────────────
  readonly profileDetail = this.sponsorService.profileDetail;
  readonly seasons = this.sponsorService.seasons;
  readonly payments = this.sponsorService.payments;
  readonly fees = this.sponsorService.fees;
  readonly isLoadingProfile = this.sponsorService.isLoadingProfile;

  readonly totalPayments = computed(() =>
    this.payments().reduce((sum, p) => sum + (p.amount ?? 0), 0)
  );

  readonly currentSeason = computed(() => this.seasonService.currentSeason());

  readonly saving = signal(false);

  constructor() {
    effect(() => {
      const id = this.sponsorProfileId();
      const newMode = this.isNew();

      if (newMode) {
        untracked(() => {
          this.sponsorService.clearDetail();
          this.resetProfileForm(BLANK_PROFILE);
        });
        return;
      }

      if (id != null) {
        untracked(() => {
          this.sponsorService.loadProfile(id);
          this.sponsorService.loadSeasons(id);
          this.sponsorService.loadPayments(id);
          this.sponsorService.loadFees();
        });
      }
    });

    // Populate form when profile data arrives
    effect(() => {
      const profile = this.profileDetail();
      if (profile != null) {
        untracked(() => this.resetProfileForm(profile));
      }
    });
  }

  private resetProfileForm(model: Partial<ProfileFormModel> & { state?: string | null }) {
    this.profileForm.spoName().value.set(model.spoName ?? '');
    this.profileForm.contactName().value.set(model.contactName ?? '');
    this.profileForm.email().value.set(model.email ?? '');
    this.profileForm.phone().value.set(model.phone ?? '');
    this.profileForm.url().value.set(model.url ?? '');
    this.profileForm.address().value.set(model.address ?? '');
    this.profileForm.city().value.set(model.city ?? '');
    this.profileForm.stateAbbr().value.set(model.state ?? '');
    this.profileForm.zip().value.set(model.zip ?? '');
    this.profileForm.typeOfBuss().value.set(model.typeOfBuss ?? '');
    this.profileForm.showAd().value.set(model.showAd ?? false);
    this.profileForm.adExpiration().value.set(model.adExpiration ?? null);
  }

  onSaveProfile() {
    if (!this.canSaveProfile()) return;
    this.saving.set(true);

    const existing = this.profileDetail();
    const payload = {
      sponsorProfileId: existing?.sponsorProfileId ?? 0,
      companyId: existing?.companyId ?? 1,
      houseId: existing?.houseId ?? null,
      spoName: this.profileForm.spoName().value() ?? '',
      contactName: this.profileForm.contactName().value() ?? '',
      email: this.profileForm.email().value() ?? '',
      phone: this.profileForm.phone().value() ?? '',
      url: this.profileForm.url().value() ?? '',
      address: this.profileForm.address().value() ?? '',
      city: this.profileForm.city().value() ?? '',
      state: this.profileForm.stateAbbr().value() ?? '',
      zip: this.profileForm.zip().value() ?? '',
      typeOfBuss: this.profileForm.typeOfBuss().value() ?? '',
      showAd: this.profileForm.showAd().value() ?? false,
      adExpiration: this.profileForm.adExpiration().value() ?? null,
    };

    this.sponsorService.saveProfile(payload as any).subscribe({
      next: () => this.saving.set(false),
      error: () => this.saving.set(false),
    });
  }

  onCancel() {
    this.closed.emit();
  }

  // ── Season add ───────────────────────────────────────────────────────────────
  onShowSeasonForm() {
    this.seasonFormModel.set({ ...BLANK_SEASON });
    this.showSeasonForm.set(true);
  }

  onCancelSeasonForm() {
    this.showSeasonForm.set(false);
  }

  onSaveSeasonEntry() {
    const profileId = this.profileDetail()?.sponsorProfileId;
    const currentSeasonId = this.currentSeason()?.seasonId;
    if (!profileId || !currentSeasonId) return;

    this.savingSeasonEntry.set(true);
    const entry: SponsorSeason = {
      sponsorId: 0,
      sponsorProfileId: profileId,
      seasonId: currentSeasonId,
      seasonDescription: this.currentSeason()?.description ?? '',
      shirtName: this.seasonForm.shirtName().value() ?? '',
      shirtSize: this.seasonForm.shirtSize().value() ?? '',
      spoAmount: this.seasonForm.spoAmount().value(),
      feeId: this.seasonForm.feeId().value(),
      mailCheck: this.seasonForm.mailCheck().value() ?? false,
      adExpiration: null,
    };

    this.sponsorService.saveSeasonEntry(entry).subscribe({
      next: () => {
        this.showSeasonForm.set(false);
        this.savingSeasonEntry.set(false);
      },
      error: () => this.savingSeasonEntry.set(false),
    });
  }

  // ── Payment add ──────────────────────────────────────────────────────────────
  onShowPaymentForm() {
    this.paymentFormModel.set({ ...BLANK_PAYMENT });
    this.showPaymentForm.set(true);
  }

  onCancelPaymentForm() {
    this.showPaymentForm.set(false);
  }

  onSavePayment() {
    const profileId = this.profileDetail()?.sponsorProfileId;
    if (!profileId || !this.canSavePayment()) return;

    this.savingPayment.set(true);
    const payment: SponsorPayment = {
      paymentId: 0,
      sponsorProfileId: profileId,
      amount: this.paymentForm.amount().value() ?? 0,
      paymentType: this.paymentForm.paymentType().value() ?? '',
      transactionDate: this.paymentForm.transactionDate().value() ?? null,
      transactionNumber: this.paymentForm.transactionNumber().value() ?? '',
      memo: this.paymentForm.memo().value() ?? '',
    };

    this.sponsorService.savePayment(payment).subscribe({
      next: () => {
        this.showPaymentForm.set(false);
        this.savingPayment.set(false);
      },
      error: () => this.savingPayment.set(false),
    });
  }
}
