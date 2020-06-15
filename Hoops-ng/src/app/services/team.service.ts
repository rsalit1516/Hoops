import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import '../rxjs-extensions';
import { Observable } from 'rxjs/Observable';

import { Team } from '../domain/team';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TeamService {
    private _TeamUrl: string;
    teams: Team[];
    constructor(private _http: HttpClient, public dataService: DataService) {
        this._TeamUrl = this.dataService.webUrl + '/api/team/GetSeasonTeams/2192';
    }

    getTeams(): Observable<Team[]> {
        return this._http.get<Team[]>(this._TeamUrl)
            .pipe(
                map(response => this.teams),
            // tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.dataService.handleError('getTeams', []))
            );
    }

    getTeam(id: number): Observable<Team> {
        return this.getTeams()
            .pipe(
            map((content: Team[]) => content.find(p => p.id === id))
            );
    }

    

}
