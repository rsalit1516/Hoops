import { Component, OnInit, inject, input } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../domain/team';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { SeasonSelectComponent } from '../admin-shared/season-select/season-select.component';
import { DivisionSelectComponent } from '../admin-shared/division-select/division-select.component';
import { DailySchedule } from '../../games/components/daily-schedule/daily-schedule';
import { Store } from '@ngrx/store';

import * as fromAdmin from '@app/admin/state';
import * as adminActions from '@app/admin//state/admin.actions';

@Component({
  selector: 'csbc-team-list',
  templateUrl: './teamList.component.html',
  imports: [
    CommonModule,
    MatTableModule,
    SeasonSelectComponent,
    DivisionSelectComponent,
    DailySchedule,
  ],
  styleUrls: [
    '../../shared/scss/tables.scss',
    './team.component.scss',
    '../admin.component.scss',
  ],
})
export class TeamListComponent implements OnInit {
  readonly teams = input<Team[]>([]);
  #store = inject(Store<fromAdmin.State>);
  errorMessage: string | undefined;
  selectedTeam: Team | undefined;
  #teamService = inject(TeamService);
  displayedColumns = ['teamId', 'name', 'teamColorId', 'teamNumber'];
  dataSource!: MatTableDataSource<Team>;
  constructor() {}

  ngOnInit() {
    // this.#teamService.getTeams()
    //   .subscribe((divisions: any[]) => this.teams = this.setTeamData(divisions),
    //     (error: any) => this.errorMessage = <any> error);
    this.#store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
      this.dataSource = new MatTableDataSource(teams);
      console.log(teams);
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
    console.log(teams);
    return teams;
  }
  addTeam() {
    // need to add team
  }
}
