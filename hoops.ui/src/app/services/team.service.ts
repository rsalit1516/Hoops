import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import '../rxjs-extensions';

import * as fromGames from "../games/state";
import * as gameActions from "../games/state/games.actions";
import * as fromUser from "@app/user/state"
import { Store, select } from "@ngrx/store";

import { Team } from '../domain/team';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class TeamService {
    seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
    currentSeason$ = this.store.select(fromGames.getCurrentSeason).subscribe({
      next: (season) => {
<<<<<<< HEAD
        // console.log(season);
=======
        console.log(season);
>>>>>>> 41113ecb3386df8f3f5ce89af4e9244c875c49c3
        if (season !== undefined && season !== null) {
          this.seasonId = season.seasonId;
        }
      },
    });

    teams!: Team[];

    private teamUrl =
    this.dataService.webUrl + "/api/Team/getSeasonTeams/";

    constructor(private _http: HttpClient, public dataService: DataService, private store: Store<fromGames.State>,
      ) {
    }

    getTeams(): Observable<Team[]> {
        return this._http.get<Team[]>(this.teamUrl + this.seasonId)
            .pipe(
                map((teams) => {return teams;}),
<<<<<<< HEAD
            // tap(data => console.log('All: ' + JSON.stringify(data))),
=======
            tap(data => console.log('All: ' + JSON.stringify(data))),
>>>>>>> 41113ecb3386df8f3f5ce89af4e9244c875c49c3
            catchError(this.dataService.handleError('getTeams', []))
            );
    }
    filterTeamsByDivision(div: number) : Observable<Team[]> {
      let filteredTeams: Team[] = [];
        this.store.pipe(select(fromGames.getTeams)).subscribe(allTeams => {
      allTeams.forEach(element => {
        if (element.divisionId === div) {
    filteredTeams.push(element);
        }
      });
    });
    return of(filteredTeams);
      }

    // getTeam(id: number): Observable<Team> {
    //     return this.getTeams()
    //         .pipe(
    //         map((content: Team[]) => content.find(p => p.id === id))
    //         );
    // }

}
