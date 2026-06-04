import { Component, computed, effect, inject } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../domain/team';

import { SeasonSelect } from '../admin-shared/season-select/season-select';
import { DivisionSelect } from '../admin-shared/division-select/division-select';
import { AdminTeamDetail } from '../admin-shared/admin-team-detail/admin-team-detail';
import { LoggerService } from '@app/services/logger.service';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../shared/generic-mat-table/generic-mat-table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'csbc-team-list',
  templateUrl: './teamList.html',
  imports: [SeasonSelect, DivisionSelect, GenericMatTableComponent, AdminTeamDetail, MatButtonModule, MatToolbarModule],
  styleUrls: ['../../shared/scss/tables.scss', '../admin.scss'],
})
export class TeamList {
  readonly #teamService = inject(TeamService);
  readonly #logger = inject(LoggerService);

  teams = computed(() => this.#teamService.divisionTeams());

  columns: TableColumn<Team>[] = [
    { key: 'teamNumber', header: 'Number', field: 'teamNumber' },
    { key: 'teamName', header: 'Team Name', field: 'teamName' },
  ];

  onSelect(team: Team): void {
    this.#logger.debug('Team selected:', team);
    this.#teamService.updateSelectedTeam(team);
  }

  addTeam(): void {
    const newTeam = new Team();
    newTeam.teamId = 0;
    newTeam.teamName = '';
    newTeam.teamNumber = '';
    newTeam.teamColorId = undefined;
    this.#teamService.updateSelectedTeam(newTeam);
  }
}
