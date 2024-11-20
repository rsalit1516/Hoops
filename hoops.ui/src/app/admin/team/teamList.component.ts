import { Component, OnInit, Input, inject } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../domain/team';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'csbc-team-list',
    templateUrl: './teamList.component.html',
    imports: [CommonModule,
        MatTableModule,
    ],
    styleUrls: ['../../shared/scss/tables.scss',
        './team.component.scss',
        '../admin.component.scss']
})
export class TeamListComponent implements OnInit {
    @Input() teams: Team[] | undefined;
    errorMessage: string | undefined;
  selectedTeam: Team | undefined;
  private _teamService = inject(TeamService);
  displayedColumns = [
    'teamId',
    'name',
    'teamColorId',
  ];
  dataSource!: MatTableDataSource<Team>;
    constructor() { }

    ngOnInit() {
         this._teamService.getTeams()
            .subscribe((divisions: any[]) => this.teams = this.setTeamData(divisions),
              (            error: any) => this.errorMessage = <any>error);
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
    return teams;
  }
}
