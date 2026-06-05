import { Component,
  computed,
  inject,
  signal,
  untracked, ChangeDetectionStrategy } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';
import { Team } from '@app/domain/team';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/services/logger.service';
import {
  DivisionTemplateSetup,
  SetupRow,
  DivisionTemplate,
  DIVISION_TEMPLATES,
} from '../division-template-setup/division-template-setup';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    DivisionTemplateSetup,
  ],
})
export class AdminSeasonWizard {
  readonly #seasonService = inject(SeasonService);
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly #authService = inject(AuthService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);
  readonly #fb = inject(UntypedFormBuilder);
  readonly #logger = inject(LoggerService);

  seasonCreated = signal(false);
  saving = signal(false);
  newSeasonId = signal<number>(0);
  newSeasonName = signal<string>('');

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

  rows = signal<SetupRow[]>(
    DIVISION_TEMPLATES.map((t) => ({
      template: t,
      selected: signal(true),
      teamCount: signal(6),
    }))
  );

  creatingDivisions = signal(false);

  canCreateDivisions = computed(() => {
    if (this.creatingDivisions()) return false;
    const selected = this.rows().filter((r) => r.selected());
    return selected.length > 0 && selected.every((r) => r.teamCount() >= 1);
  });

  save(): void {
    if (!this.form.valid) return;

    this.saving.set(true);
    const v = this.form.value;
    const season = new Season();
    season.seasonId = 0;
    season.description = v.name ?? '';
    season.fromDate = v.startDate || undefined;
    season.toDate = v.endDate || undefined;
    season.participationFee = v.playerFee ? Number(v.playerFee) : 0;
    season.sponsorFee = v.sponsorFee ? Number(v.sponsorFee) : 0;
    season.convenienceFee = v.convenienceFee ? Number(v.convenienceFee) : 0;
    season.sponsorDiscount = v.sponsorDiscount ? Number(v.sponsorDiscount) : 0;
    season.onlineStarts = v.signUpStartDate || undefined;
    season.onlineStops = v.signUpEndDate || undefined;
    season.currentSeason = !!v.currentSeason;
    season.currentSchedule = !!v.currentSchedule;
    season.currentSignUps = !!v.currentSignUps;
    season.onlineRegistration = !!v.onlineRegistration;
    season.gameSchedules = false;

    const userId = this.#authService.currentUser()?.userId;

    this.#seasonService.postSeason(season, userId).subscribe({
      next: (created) => {
        const s = created as Season;
        const sid = s.seasonId ?? 0;

        if (!sid) {
          // DataService.handleError returned the payload — the POST actually failed
          this.#logger.error('Season POST returned no id — possible API error');
          untracked(() => this.saving.set(false));
          this.#snackBar.open(
            'Failed to create season. Please try again.',
            'Close',
            { duration: 4000 }
          );
          return;
        }

        this.#logger.info('Season created in wizard:', s);
        this.#snackBar.open('Season created', 'OK', { duration: 2500 });
        // updateSelectedSeason writes a signal — wrap in untracked() to avoid NG0600
        untracked(() => {
          this.#seasonService.updateSelectedSeason(s);
          this.newSeasonId.set(sid);
          this.newSeasonName.set(s.description ?? v.name ?? '');
          this.saving.set(false);
        });
        this.#seasonService.fetchSeasons();
        this.#seasonService.fetchCurrentSeason();
        this.createDivisions(sid);
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

  createDivisions(seasonId?: number): void {
    const sid = seasonId ?? this.newSeasonId();
    if (!sid) return;

    const selectedRows = this.rows().filter(
      (r) => r.selected() && r.teamCount() >= 1
    );
    if (!selectedRows.length) return;

    // Called from within a subscribe next callback — untracked() prevents NG0600
    untracked(() => this.creatingDivisions.set(true));
    const total = selectedRows.length;
    let remaining = total;

    for (const row of selectedRows) {
      const division = this.buildDivision(row.template, sid);
      this.#divisionService.save(division)!.pipe(
        tap((created) => {
          const count = row.teamCount();
          for (let i = 0; i < count; i++) {
            const team = new Team();
            team.teamId = 0;
            team.divisionId = (created as Division).divisionId;
            team.teamNumber = String(i + 1);
            team.teamName = `Team ${i + 1}`;
            this.#teamService.addTeam(team).pipe(catchError(() => of(null))).subscribe();
          }
        }),
        catchError((err) => {
          this.#logger.error(`Failed to create division ${row.template.name}`, err);
          return of(null);
        })
      ).subscribe({
        next: () => {
          remaining--;
          if (remaining === 0) {
            untracked(() => {
              this.creatingDivisions.set(false);
              this.seasonCreated.set(true);
            });
            this.#snackBar.open(
              `${total} division(s) and their teams created.`,
              'OK',
              { duration: 4000 }
            );
          }
        },
      });
    }
  }

  finish(): void {
    this.#router.navigate(['/admin/seasons/list']);
  }

  private buildDivision(template: DivisionTemplate, seasonId: number): Division {
    const currentYear = new Date().getFullYear();
    const d = new Division();
    d.divisionId = 0;
    d.seasonId = seasonId;
    d.divisionDescription = template.name;
    d.gender = template.gender1;
    d.minDate = new Date(currentYear - template.minYears1, 8, 1);
    d.maxDate = new Date(
      currentYear - template.maxYears1,
      template.maxMonth1 - 1,
      template.maxDay1
    );
    if (template.gender2) {
      d.gender2 = template.gender2;
      if (template.minYears2 !== null && template.maxYears2 !== null) {
        d.minDate2 = new Date(currentYear - template.minYears2, 8, 1);
        d.maxDate2 = new Date(
          currentYear - template.maxYears2,
          (template.maxMonth2 ?? 8) - 1,
          template.maxDay2 ?? 31
        );
      }
    } else {
      d.gender2 = '';
    }
    return d;
  }
}
