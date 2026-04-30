import { Component, OnInit, inject, input } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../domain/team';
import { MatTableDataSource } from '@angular/material/table';

import { SeasonSelect } from '../admin-shared/season-select/season-select';
import { DivisionSelect } from '../admin-shared/division-select/division-select';

import { Store } from '@ngrx/store';

import * as fromAdmin from '@app/admin/state';
import * as adminActions from '@app/admin//state/admin.actions';
import { LoggerService } from '@app/services/logger.service';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../shared/generic-mat-table/generic-mat-table';

@Component({
  selector: 'csbc-team-list',
  templateUrl: './teamList.html',
  imports: [SeasonSelect, DivisionSelect, GenericMatTableComponent],
  styleUrls: ['../../shared/scss/tables.scss', './team.scss', '../admin.scss'],
})
export class TeamList implements OnInit {
  readonly teams = input<Team[]>([]);
  #store = inject(Store<fromAdmin.State>);
  #logger = inject(LoggerService);
  errorMessage: string | undefined;
  selectedTeam: Team | undefined;
  #teamService = inject(TeamService);
  columns: TableColumn<Team>[] = [
    { key: 'teamId', header: 'ID', field: 'teamId' },
    { key: 'name', header: 'Team', field: 'name' },
    { key: 'teamColorId', header: 'Color', field: 'teamColorId' },
    { key: 'teamNumber', header: 'Number', field: 'teamNumber' },
  ];
  dataSource!: MatTableDataSource<Team>;
  constructor() {}

  ngOnInit() {
    // this.#teamService.getTeams()
    //   .subscribe((divisions: any[]) => this.teams = this.setTeamData(divisions),
    //     (error: any) => this.errorMessage = <any> error);
    this.#store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
      this.dataSource = new MatTableDataSource(teams);
      this.#logger.debug('Division teams loaded:', teams);
    });
  }

  onSelect(team: Team): void {
    this.selectedTeam = team;
  }
  setTeamData(data: any[]): Team[] {
    let teams: Team[] = [];
    for (let i = 0; i <= data.length; i++) {
      if (data[i] !== undefined) {
        let team: Team = new Team();
        team.teamId = data[i].teamID;
        team.name = data[i].teamNumber;
        team.teamColorId = data[i].colorID;
        teams.push(team);
      }
    }
    this.#logger.debug('Processed teams:', teams);
    return teams;
  }
  addTeam() {
    // need to add team
  }
}
