import {
  Component,
  inject,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Season } from '@app/domain/season';
import { SeasonService } from '@app/services/season.service';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/services/logger.service';
import { SeasonSetup } from '../../containers/season-setup/season-setup';

@Component({
  selector: 'admin-season-wizard',
  templateUrl: './admin-season-wizard.html',
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    '../../admin.scss',
    './admin-season-wizard.scss',
  ],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatStepperModule,
    SeasonSetup,
  ],
})
export class AdminSeasonWizard {
  @ViewChild(MatStepper) stepper!: MatStepper;

  readonly #seasonService = inject(SeasonService);
  readonly #authService = inject(AuthService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);
  readonly #fb = inject(UntypedFormBuilder);
  readonly #logger = inject(LoggerService);

  seasonCreated = signal(false);
  saving = signal(false);

  form = this.#fb.group({
    name: ['', Validators.required],
    startDate: [''],
    endDate: [''],
    playerFee: [''],
    sponsorFee: [''],
    convenienceFee: [''],
    sponsorDiscount: [''],
    signUpStartDate: [''],
    signUpEndDate: [''],
    currentSeason: [false],
    currentSchedule: [false],
    currentSignUps: [false],
    onlineRegistration: [false],
  });

  saveAndContinue(): void {
    if (!this.form.valid) return;

    this.saving.set(true);
    const v = this.form.value;
    const season = new Season();
    season.seasonId = 0;
    season.description = v.name ?? '';
    season.fromDate = v.startDate ?? undefined;
    season.toDate = v.endDate ?? undefined;
    season.participationFee = v.playerFee ? Number(v.playerFee) : 0;
    season.sponsorFee = v.sponsorFee ? Number(v.sponsorFee) : 0;
    season.convenienceFee = v.convenienceFee ? Number(v.convenienceFee) : 0;
    season.sponsorDiscount = v.sponsorDiscount ? Number(v.sponsorDiscount) : 0;
    season.onlineStarts = v.signUpStartDate ?? undefined;
    season.onlineStops = v.signUpEndDate ?? undefined;
    season.currentSeason = !!v.currentSeason;
    season.currentSchedule = !!v.currentSchedule;
    season.currentSignUps = !!v.currentSignUps;
    season.onlineRegistration = !!v.onlineRegistration;
    season.gameSchedules = false;

    const userId = this.#authService.currentUser()?.userId;

    this.#seasonService.postSeason(season, userId).subscribe({
      next: (created) => {
        this.#logger.info('Season created in wizard:', created);
        this.#seasonService.updateSelectedSeason(created as Season);
        this.#seasonService.fetchSeasons();
        this.#seasonService.fetchCurrentSeason();
        this.#snackBar.open('Season created', 'OK', { duration: 2500 });
        untracked(() => {
          this.seasonCreated.set(true);
          this.saving.set(false);
        });
        // Mark step 1 complete before advancing so linear stepper allows the transition
        const step1 = this.stepper.steps.get(0);
        if (step1) step1.completed = true;
        this.stepper.next();
      },
      error: (err) => {
        this.#logger.error('Failed to create season in wizard', err);
        untracked(() => this.saving.set(false));
        this.#snackBar.open(
          'Failed to create season. Please try again.',
          'Close',
          { duration: 4000 }
        );
      },
    });
  }

  finish(): void {
    this.#router.navigate(['/admin/seasons/list']);
  }
}
