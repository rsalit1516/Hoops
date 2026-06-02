import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';

interface DivisionSetupRow {
  division: Division;
  selected: WritableSignal<boolean>;
  teamCount: WritableSignal<number>;
}

@Component({
  selector: 'csbc-admin-season-setup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: './admin-season-setup.html',
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    '../../admin.scss',
  ],
})
export class AdminSeasonSetup implements OnInit {
  private readonly seasonService = inject(SeasonService);
  private readonly divisionService = inject(DivisionService);
  private readonly teamService = inject(TeamService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  readonly season = signal(this.seasonService.seasons.find(
    s => s.seasonId === +this.route.snapshot.params['seasonId']
  ) ?? null);

  readonly rows = signal<DivisionSetupRow[]>([]);
  readonly isSubmitting = signal(false);

  readonly canSubmit = computed(() =>
    !this.isSubmitting() &&
    this.rows().some(r => r.selected()) &&
    this.rows().filter(r => r.selected()).every(r => r.teamCount() > 0)
  );

  ngOnInit(): void {
    const s = this.season();
    const seasonYear = s?.fromDate ? new Date(s.fromDate).getFullYear() : new Date().getFullYear();
    this.rows.set(
      this.divisionService.getSetupDivisions().map(name => ({
        division: this.divisionService.getDefaultDivisionForSetup(name, seasonYear),
        selected: signal(false),
        teamCount: signal(0),
      }))
    );
  }

  toggleSelected(row: DivisionSetupRow): void {
    row.selected.update(v => !v);
  }

  setTeamCount(row: DivisionSetupRow, value: string): void {
    const n = parseInt(value, 10);
    row.teamCount.set(isNaN(n) || n < 0 ? 0 : n);
  }

  onSubmit(): void {
    const selected = this.rows().filter(r => r.selected());
    this.isSubmitting.set(true);

    forkJoin(selected.map(r => this.divisionService.save(r.division)!)).subscribe({
      next: (createdDivisions) => {
        const teamCreates = createdDivisions.flatMap((div, i) =>
          Array.from({ length: selected[i].teamCount() }, (_, t) => {
            const team = new Team();
            team.teamId = 0;
            team.divisionId = (div as Division).divisionId;
            team.teamNumber = String(t + 1);
            team.teamColorId = 0;
            return this.teamService.addTeam(team);
          })
        );

        if (teamCreates.length === 0) {
          this.onSuccess(createdDivisions.length, 0);
          return;
        }

        forkJoin(teamCreates).subscribe({
          next: (teams) => this.onSuccess(createdDivisions.length, teams.length),
          error: (err) => this.onError(err),
        });
      },
      error: (err) => this.onError(err),
    });
  }

  skip(): void {
    this.router.navigate(['/admin/seasons/list']);
  }

  private onSuccess(divCount: number, teamCount: number): void {
    this.isSubmitting.set(false);
    this.snackBar.open(
      `Created ${divCount} division${divCount !== 1 ? 's' : ''} and ${teamCount} team${teamCount !== 1 ? 's' : ''}`,
      'OK',
      { duration: 3000 }
    );
    this.router.navigate(['/admin/seasons/list']);
  }

  private onError(err: unknown): void {
    this.isSubmitting.set(false);
    this.snackBar.open('Error setting up divisions. Please try again.', 'Close', { duration: 5000 });
    console.error(err);
  }
}
