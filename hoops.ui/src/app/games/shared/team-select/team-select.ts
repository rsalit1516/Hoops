import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TeamService } from '@app/services/team.service';
import { Team } from '@app/domain/team';

@Component({
  selector: 'team-select',
  template: `
    <mat-form-field>
      <mat-label>{{ title() }}</mat-label>
      <mat-select
        [(value)]="team"
        [compareWith]="compareById"
        class="form-control"
      >
        @for (t of teamService.divisionTeams(); track t.teamId) {
        <mat-option [value]="t" (click)="changeTeam(t)">
          {{ t.teamName }}
        </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styleUrls: [
    '../../../shared/scss/select.scss',
    '../../../shared/scss/forms.scss',
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class TeamSelect implements OnInit {
  readonly teamService = inject(TeamService);
  // Optional customizable label
  title = input<string>('Team');

  // Bind to current selected team from the service via a computed
  selectedTeamSig = computed(() => this.teamService.selectedTeam);
  team: Team | undefined = this.selectedTeamSig();

  constructor() {
    effect(() => {
      this.team = this.selectedTeamSig();
    });
  }

  ngOnInit(): void {}

  changeTeam(team: Team | null) {
    this.teamService.updateSelectedTeam(team ?? undefined);
  }

  compareById = (a: Team | undefined, b: Team | undefined) => {
    if (!a || !b) return a === b;
    return a.teamId === b.teamId && a.divisionId === b.divisionId;
  };
}
