import {
  Component,
  computed,
  inject,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { SeasonService } from '@app/services/season.service';
import { Constants } from '@app/shared/constants';
import { SeasonSelect } from '../../admin-shared/season-select/season-select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface DivisionTemplate {
  name: string;
  gender1: string;
  minYears1: number;
  maxYears1: number;
  maxMonth1: number;
  maxDay1: number;
  gender2: string | null;
  minYears2: number | null;
  maxYears2: number | null;
  maxMonth2: number | null;
  maxDay2: number | null;
}

interface SetupRow {
  template: DivisionTemplate;
  selected: WritableSignal<boolean>;
  teamCount: WritableSignal<number>;
}

const DIVISION_TEMPLATES: DivisionTemplate[] = [
  {
    name: Constants.SETUP_TR2COED,
    gender1: 'M', minYears1: 9, maxYears1: 6, maxMonth1: 3, maxDay1: 31,
    gender2: 'F', minYears2: 9, maxYears2: 6, maxMonth2: 3, maxDay2: 31,
  },
  {
    name: Constants.SETUP_TR4,
    gender1: 'M', minYears1: 11, maxYears1: 9, maxMonth1: 8, maxDay1: 31,
    gender2: null, minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_INTBOYS,
    gender1: 'M', minYears1: 13, maxYears1: 11, maxMonth1: 8, maxDay1: 31,
    gender2: 'M', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_JVBOYS,
    gender1: 'M', minYears1: 15, maxYears1: 13, maxMonth1: 8, maxDay1: 31,
    gender2: 'M', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_HSBOYS,
    gender1: 'M', minYears1: 19, maxYears1: 15, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_INTGIRLS,
    gender1: 'F', minYears1: 13, maxYears1: 9, maxMonth1: 8, maxDay1: 31,
    gender2: null, minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_JVGIRLS,
    gender1: 'F', minYears1: 15, maxYears1: 13, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_HSGIRLS,
    gender1: 'F', minYears1: 19, maxYears1: 15, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_MEN,
    gender1: 'M', minYears1: 46, maxYears1: 19, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_WOMEN,
    gender1: 'F', minYears1: 46, maxYears1: 19, maxMonth1: 8, maxDay1: 31,
    gender2: null, minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
];

@Component({
  selector: 'season-setup',
  templateUrl: './season-setup.html',
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    '../../admin.scss',
    './season-setup.scss',
  ],
  imports: [
    SeasonSelect,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
})
export class SeasonSetup {
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly #seasonService = inject(SeasonService);
  readonly #snackBar = inject(MatSnackBar);

  selectedSeason = computed(() => this.#seasonService.selectedSeason());

  rows = signal<SetupRow[]>(
    DIVISION_TEMPLATES.map((t) => ({
      template: t,
      selected: signal(true),
      teamCount: signal(6),
    }))
  );

  submitting = signal(false);

  canSubmit = computed(() => {
    const season = this.selectedSeason();
    if (!season?.seasonId) return false;
    if (this.submitting()) return false;
    const selected = this.rows().filter((r) => r.selected());
    return selected.length > 0 && selected.every((r) => r.teamCount() >= 1);
  });

  setTeamCount(row: SetupRow, value: string): void {
    const n = parseInt(value, 10);
    row.teamCount.set(isNaN(n) || n < 1 ? 1 : n);
  }

  submit(): void {
    const seasonId = this.selectedSeason()?.seasonId;
    if (!seasonId) return;

    const selectedRows = this.rows().filter(
      (r) => r.selected() && r.teamCount() >= 1
    );
    if (!selectedRows.length) return;

    this.submitting.set(true);
    const total = selectedRows.length;
    let remaining = total;

    for (const row of selectedRows) {
      const division = this.buildDivision(row.template, seasonId);
      this.#divisionService.save(division)!.pipe(
        tap((created) => {
          const count = row.teamCount();
          for (let i = 0; i < count; i++) {
            const team = new Team();
            team.teamId = 0;
            team.divisionId = (created as Division).divisionId;
            team.teamNumber = String(i + 1);
            team.teamColorId = 0;
            this.#teamService.addTeam(team).pipe(catchError(() => of(null))).subscribe();
          }
        }),
        catchError((err) => {
          console.error(`Failed to create division ${row.template.name}`, err);
          return of(null);
        })
      ).subscribe({
        next: () => {
          remaining--;
          if (remaining === 0) {
            untracked(() => this.submitting.set(false));
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

  private buildDivision(template: DivisionTemplate, seasonId: number): Division {
    const currentYear = new Date().getFullYear();
    const d = new Division();
    d.divisionId = 0;
    d.seasonId = seasonId;
    d.divisionDescription = template.name;
    d.gender = template.gender1;
    d.minDate = new Date(currentYear - template.minYears1, 8, 1); // Sep 1
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
