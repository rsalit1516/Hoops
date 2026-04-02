import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Team } from '@app/domain/team';
import { TeamService } from '@app/services/team.service';
import { ColorService } from '@app/admin/admin-shared/services/color.service';

@Component({
  selector: 'csbc-dashboard-teams',
  imports: [MatCardModule, MatListModule],
  templateUrl: './dashboard-teams.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.scss',
    '../../admin.scss',
  ],
})
export class DashboardTeams {
  private teamService = inject(TeamService);
  private colorService = inject(ColorService);
  selectedDivision = this.teamService.selectedDivision;
  divisionTeams = this.teamService.divisionTeams;
  selectedTeam: Team | undefined;
  teamCount = computed(() => this.divisionTeams().length);

  getDisplayLabel(team: Team): string {
    const num = team.teamNumber ? `#${team.teamNumber}` : '';
    const color = this.colorService.colors().find(c => c.colorId === team.teamColorId)?.colorName ?? '';
    const name = team.teamName?.trim() ?? '';
    return [num, color, name].filter(Boolean).join(' · ');
  }

  setTeam(team: Team) {
    this.teamService.updateSelectedTeam(team);
  }
}
