import { Component, OnInit, Input } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../domain/team';

@Component({
    selector: 'csbc-team-list',
    templateUrl: './teamList.component.html',
    styleUrls: ['./team.component.scss', '../admin.component.scss']

})
export class TeamListComponent implements OnInit {
    @Input() teams: Team[] | undefined;
    errorMessage: string | undefined;
    selectedTeam: Team | undefined;

    constructor(private _teamService: TeamService) { }

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
      console.log(data[i]);
      if (data[i] !== undefined) {
        let team: Team = new Team();
        team.teamId = data[i].teamID;
        team.name = data[i].teamNumber;
        team.teamColorId = data[i].colorID;
        teams.push(team);
      }
      console.log(teams);
    }
    return teams;
  }
}
