import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Team } from '@app/domain/team';
import { DataService } from '@app/services/data.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService as MainTeamService } from '@app/services/team.service';
import { Constants } from '@app/shared/constants';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '@app/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly dataService = inject(DataService);
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly divisionService = inject(DivisionService);
  private readonly mainTeamService = inject(MainTeamService);

  filterTeamsByDivision(div: number): Observable<Team[]> {
    return of(this.mainTeamService.filterTeamsByDivision(div));
  }

  saveTeam(team: Team): void {
    this.logger.info('Saving team:', team);
    if (team.teamId === 0) {
      this.addTeam(team).subscribe((savedTeam) => {
        this.logger.info('Team created:', savedTeam);
        this.mainTeamService.getSeasonTeams();
      });
    } else {
      this.updateTeam(team).subscribe(() => {
        this.mainTeamService.getSeasonTeams();
      });
    }
  }

  addTeam(team: Team): Observable<Team | ArrayBuffer> {
    this.logger.debug('Adding team to URL:', Constants.teamPostUrl);
    return this.http
      .post<Team>(Constants.teamPostUrl, team, this.dataService.httpOptions)
      .pipe(catchError(this.dataService.handleError('addTeam', team)));
  }

  addNewTeamDefaults(team: Team) {
    team.divisionId = this.divisionService.selectedDivision()?.divisionId ?? 0;
    return team;
  }

  newTeam() {
    const team = new Team();
    team.teamId = 0;
    team.divisionId = this.divisionService.selectedDivision()?.divisionId ?? 0;
    return team;
  }

  updateTeam(team: Team) {
    return this.http
      .put<Team>(
        Constants.teamPutUrl + team.teamId,
        team,
        this.dataService.httpOptions
      )
      .pipe(catchError(this.dataService.handleError('updateTeam', team)));
  }
}
