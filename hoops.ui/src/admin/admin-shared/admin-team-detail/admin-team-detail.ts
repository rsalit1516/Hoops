import { Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Team } from '@app/domain/team';

import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';
import { TeamService } from '@app/services/team.service';
import { ColorService } from '../services/color.service';
import { LoggerService } from '@app/services/logger.service';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-team-detail',
  templateUrl: './admin-team-detail.html',
  styleUrls: [
    './../../../shared/scss/forms.scss',
    './../../../shared/scss/cards.scss',
    './admin-team-detail.scss',
    '../../admin.scss',
  ],
  imports: [
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class AdminTeamDetail implements OnInit {
  readonly teamService = inject(TeamService);
  private readonly divisionService = inject(DivisionService);
  private readonly seasonService = inject(SeasonService);
  readonly colorService = inject(ColorService);
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NotificationService);
  private logger = inject(LoggerService);

  teamFormModel = signal({
    teamNo: '',
    color: null as number | null,
    teamName: '',
  });

  editTeamForm = form(this.teamFormModel);

  isTeamNoEmpty = computed(() => {
    const val = this.editTeamForm.teamNo().value();
    return !val || val.trim() === '';
  });

  isDuplicateTeamNumber = computed(() => {
    const teamNo = this.editTeamForm.teamNo().value()?.trim();
    if (!teamNo) return false;
    const currentTeamId = this.teamService.selectedTeamSignal()?.teamId ?? 0;
    return this.teamService.divisionTeams().some(
      t => t.teamNumber === teamNo && t.teamId !== currentTeamId,
    );
  });

  isExistingTeam = computed(() =>
    (this.teamService.selectedTeamSignal()?.teamId ?? 0) > 0,
  );

  isFormValid = computed(
    () =>
      !this.isTeamNoEmpty() &&
      !this.isDuplicateTeamNumber() &&
      this.editTeamForm.teamName().valid(),
  );

  isFormDirty = computed(
    () =>
      this.editTeamForm.teamNo().dirty() ||
      this.editTeamForm.color().dirty() ||
      this.editTeamForm.teamName().dirty(),
  );

  selectedSeason = computed(() => this.seasonService.selectedSeason);
  selectedDivision = computed(() => this.divisionService.selectedDivision());

  title = 'Team';

  constructor() {
    effect(() => {
      const team = this.teamService.selectedTeamSignal();
      this.logger.debug('Selected team changed:', team);

      if (team) {
        untracked(() => {
          this.editTeamForm.teamNo().value.set(team.teamNumber || '');
          this.editTeamForm.color().value.set(team.teamColorId ?? null);
          this.editTeamForm.teamName().value.set(team.teamName || '');
        });
      }
    });
  }

  ngOnInit(): void {}

  newTeam() {
    const newTeam = new Team();
    newTeam.teamId = 0;
    newTeam.teamName = '';
    newTeam.teamNumber = '';
    newTeam.teamColorId = undefined;
    newTeam.divisionId = this.selectedDivision()?.divisionId ?? 0;
    this.teamService.updateSelectedTeam(newTeam);
  }

  save() {
    if (!this.isFormValid() || !this.isFormDirty()) {
      return;
    }

    const formValue = {
      teamNo: this.editTeamForm.teamNo().value(),
      color: this.editTeamForm.color().value(),
      teamName: this.editTeamForm.teamName().value(),
    };

    const team: Team = {
      teamId: this.teamService.selectedTeam?.teamId ?? 0,
      name: '',
      divisionId: this.selectedDivision()?.divisionId ?? 0,
      teamNumber: formValue.teamNo,
      teamColorId: formValue.color ?? undefined,
      teamName: formValue.teamName,
    };

    this.teamService.saveTeam(team).subscribe({
      next: () => {
        this.notify.success('Team saved');
        this.teamService.getSeasonTeams();
        this.newTeam();
      },
      error: () => {
        this.notify.error('Failed to save team');
      },
    });
  }

  cancel() {
    this.newTeam();
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Team?',
        message: 'Are you sure you want to delete this team?',
      },
      panelClass: 'csbc-login-dialog-panel',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteTeam();
    });
  }

  private deleteTeam(): void {
    const teamId = this.teamService.selectedTeamSignal()?.teamId;
    if (!teamId) return;
    this.teamService.deleteTeam(teamId).subscribe({
      next: () => {
        this.notify.success('Team deleted');
        this.teamService.getSeasonTeams();
        this.newTeam();
      },
      error: () => {
        this.notify.error('Failed to delete team');
      },
    });
  }
}
