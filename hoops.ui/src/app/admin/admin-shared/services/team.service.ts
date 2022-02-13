import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminActionTypes } from '@app/admin/state/admin.actions';
import { Team } from '@app/domain/team';
import { DataService } from '@app/services/data.service';
import { Constants } from '@app/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(
    private dataService: DataService,
    private store: Store<fromAdmin.State>,
    private http: HttpClient
  ) {}

  filterTeamsByDivision(div: number): Observable<Team[]> {
    let filteredTeams: Team[] = [];
    this.store.pipe(select(fromAdmin.getSeasonTeams)).subscribe((teams) => {
      teams?.forEach((team) => {
        if (team.divisionId === div) {
          filteredTeams.push(team);
        }
      });
    });
    // this.store.pipe(select(fromGames.getTeams)).subscribe((allTeams) => {
    //   allTeams.forEach((element) => {
    //     if (element.divisionId === div) {
    //       filteredTeams.push(element);
    //     }
    //   });
    // });
    return of(filteredTeams);
  }
  saveTeam(team: Team): void {
    console.log('saving');
    console.log(team);
    team.createdDate = new Date();

    if (team.teamId === 0) {
      this.addTeam(team).subscribe(team => {
        console.log(team);
      this.store.dispatch(new adminActions.LoadSeasonTeams());
      });
    } else {
      this.updateTeam(team);
    }
  }
  addTeam(team: Team) : Observable<Team | ArrayBuffer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(this.dataService.teamPostUrl);
      return this.http
        .post<Team>(this.dataService.teamPostUrl, team, this.dataService.httpOptions)
        .pipe(catchError(this.dataService.handleError('addTeam', team)));
  }
  addNewTeamDefaults(team: Team) {
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      let d = division?.divisionId;
      team.divisionId = d as number;
      return team;
    });
    return team;
  }
  newTeam() {
    let team = new Team();
    team.teamId = 0;
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      let d = division?.divisionId;
      team.divisionId = d as number;
      return team;
    });
    return team;
  }
  updateTeam(team:Team) {
    return this.http
        .put<Team>(this.dataService.teamPostUrl + team.teamId, team, this.dataService.httpOptions)
        .pipe(catchError(this.dataService.handleError('updateTeam', team)));
  }
}
