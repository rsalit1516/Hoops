import { Injectable } from '@angular/core';
import { Team } from '@app/domain/team';
import { DataService } from '@app/services/data.service';
import { Constants } from '@app/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as fromAdmin from '../state/';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(
    private dataService: DataService,
    private store: Store<fromAdmin.State>
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
}
