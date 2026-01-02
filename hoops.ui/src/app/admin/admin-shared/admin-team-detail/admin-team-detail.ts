import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { form, Field } from '@angular/forms/signals';
import { Team } from '@app/domain/team';

import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@app/services/auth.service';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';
import { TeamService } from '@app/services/team.service';
import { ColorService } from '../services/color.service';
import { LocationService } from '../services/location.service';
import { LoggerService } from '@app/services/logger.service';
@Component({
  selector: 'app-admin-team-detail',
  templateUrl: './admin-team-detail.html',
  styleUrls: [
    './../../../shared/scss/forms.scss',
    './../../../shared/scss/cards.scss',
    './admin-team-detail.scss',
    '../../admin.scss',
  ],
  imports: [
    Field,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class AdminTeamDetail implements OnInit {
  private readonly authService = inject(AuthService);
  readonly teamService = inject(TeamService);
  private readonly divisionService = inject(DivisionService);
  private readonly seasonService = inject(SeasonService);
  readonly colorService = inject(ColorService);
  readonly locationService = inject(LocationService);
  private logger = inject(LoggerService);

  user = computed(() => this.authService.currentUser());

  // Signal Forms - Define the form data model
  teamFormModel = signal({
    teamNo: '',
    color: null as number | null,
    teamName: '',
  });

  // Create signal form
  editTeamForm = form(this.teamFormModel);

  // Computed signals for form state
  isFormValid = computed(() =>
    this.editTeamForm.teamNo().valid() &&
    this.editTeamForm.teamName().valid()
  );
  isFormDirty = computed(() =>
    this.editTeamForm.teamNo().dirty() ||
    this.editTeamForm.color().dirty() ||
    this.editTeamForm.teamName().dirty()
  );

  selectedSeason = computed(() => this.seasonService.selectedSeason);
  selectedDivision = computed(() => this.divisionService.selectedDivision());

  title = 'Team';

  constructor() {
    // Effect to populate form when selected team changes
    effect(() => {
      // Use the readonly signal to track changes
      const team = this.teamService.selectedTeamSignal();
      this.logger.debug('Selected team changed:', team);

      if (team) {
        // Use untracked() to prevent infinite loop when setting form values
        untracked(() => {
          this.logger.debug('Setting form values from team:', {
            teamNo: team.teamNumber || '',
            color: team.teamColorId ?? null,
            teamName: team.teamName || ''
          });

          this.editTeamForm.teamNo().value.set(team.teamNumber || '');
          this.editTeamForm.color().value.set(team.teamColorId ?? null);
          this.editTeamForm.teamName().value.set(team.teamName || '');

          this.logger.debug('Form values after setting:', {
            teamNo: this.editTeamForm.teamNo().value(),
            color: this.editTeamForm.color().value(),
            teamName: this.editTeamForm.teamName().value()
          });
        });
      }
    });
  }

  ngOnInit(): void {}

  newTeam() {
    this.logger.debug('Creating new team - clearing form');

    // Create a completely new team object with all properties initialized
    const newTeam = new Team();
    newTeam.teamId = 0;
    newTeam.teamName = '';
    newTeam.teamNumber = '';
    newTeam.teamColorId = null;
    newTeam.divisionId = this.selectedDivision()?.divisionId ?? 0;

    this.logger.debug('New team object created:', newTeam);

    // Update selected team - this will trigger the effect which clears the form
    this.teamService.updateSelectedTeam(newTeam);

    this.logger.debug('Selected team updated, effect should fire');
  }
  save() {
    if (!this.isFormValid() || !this.isFormDirty()) {
      return;
    }

    // Get values from signal form
    const formValue = {
      teamNo: this.editTeamForm.teamNo().value(),
      color: this.editTeamForm.color().value(),
      teamName: this.editTeamForm.teamName().value(),
    };

    this.logger.info('Saving team with form values:', formValue);

    const team: Team = {
      teamId: this.teamService.selectedTeam?.teamId ?? 0,
      name: '',
      divisionId: this.selectedDivision()?.divisionId ?? 0,
      teamNumber: formValue.teamNo,
      teamColorId: formValue.color,
      teamName: formValue.teamName,
      createdUser: this.user()?.userName ?? 'system',
      createdDate: new Date(),
    };

    // Subscribe to save, then refresh list and reset form
    this.teamService.saveTeam(team).subscribe({
      next: (savedTeam) => {
        this.logger.info('Team saved successfully:', savedTeam);
        // Refresh the team list
        this.teamService.getSeasonTeams();
        // Reset form for new team entry
        this.newTeam();
      },
      error: (error) => {
        this.logger.error('Error saving team:', error);
        // TODO: Show user-friendly error message
      }
    });
  }

  cancel() {
    this.newTeam();
  }
}
