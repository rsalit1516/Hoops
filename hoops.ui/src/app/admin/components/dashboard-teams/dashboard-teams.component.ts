import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Team } from '@app/domain/team';
import { TeamService } from '@app/services/team.service';

@Component({
  selector: 'csbc-dashboard-teams',
  imports: [
    MatCardModule,
    MatListModule
  ],
  templateUrl: './dashboard-teams.component.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.component.scss',
    '../../admin.component.scss'
  ],
})
export class DashboardTeamsComponent {
  readonly #teamService = inject(TeamService);
  selectedDivision = this.#teamService.selectedDivision;
  divisionTeams = this.#teamService.divisionTeams;
  selectedTeam: Team | undefined;
  teamCount = this.divisionTeams?.length;
  setTeam (team: Team) {
    this.#teamService.updateSelectedTeam(team);
  }
}
