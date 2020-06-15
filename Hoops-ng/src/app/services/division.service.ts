import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../rxjs-extensions';

import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../admin/state';

@Injectable()
export class DivisionService {
  private _divisionUrl =
    this.dataService.webUrl + '/api/division/GetSeasonDivisions/';

  private season: Season;
  private _seasonId: number;
  divisionUrl: string;
  get seasonId() {
    return this._seasonId;
  }
  set seasonId(seasonId: number) {
    this._seasonId = seasonId;
  }
  // divisions: Division[];
  private selectedSeason$ = this.store.pipe(select(fromAdmin.getSeasons));

  private _divisions$ = this._http
    .get<Division[]>(this.divisionUrl + this.selectedSeason$)
    .pipe(
      map(divisions =>
        divisions.map(
          division =>
            ({
              ...division
            } as Division)
        )
      ),
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', null))
    );
  public get divisions$() {
    return this._divisions$;
  }
  public set divisions$(value) {
    this._divisions$ = value;
  }
  constructor(
    private _http: HttpClient,
    public dataService: DataService,
    public seasonService: SeasonService,
    private store: Store<fromAdmin.State>
  ) {
    //      SeasonService.getCurrent().subscribe(season => (this.season = season));
    //  SeasonService.selectedSeason..currentSeason.subscribe(
    //  season =>
    // this.seasonId = SeasonService.selectedSeason.seasonID;
    // this._divisionUrl =
    //   this.DataService.webUrl +
    //   '/api/division/GetSeasonDivisions/' +
    //   this.season.seasonID;
  }

  getDivisions(seasonId: number): Observable<Division[]> {
    console.log(seasonId);
    if (seasonId === undefined) {
      seasonId = 2192;
    }
    this._divisionUrl =
      this.dataService.webUrl + '/api/division/GetSeasonDivisions/' + seasonId;
    return this._http.get<Division[]>(this._divisionUrl).pipe(
      // map((response: Response) => <Division[]>),
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', []))
    );
  }

  getSeasonDivisions(season: Observable<Season>): Observable<Division[]> {
    console.log(season);
    season.subscribe(
      d =>
        (this._divisionUrl =
          this.dataService.webUrl +
          '/api/division/GetSeasonDivisions/' +
          d.seasonID)
    );
    this.seasonId = 2193;
    if (season !== null) {
      if (this.season.seasonID === undefined) {
        this.seasonId = 2193;
      } else {
        season.subscribe(s => (this.seasonId = s.seasonID));
        console.log(this.seasonId);
      }
    }
    console.log(season);
    if (this.seasonId === undefined) {
      this.seasonId = 2193;
    }
    // console.log(season.seasonID);
    // season.su
    this._divisionUrl =
      this.dataService.webUrl + '/api/division/GetSeasonDivisions/2083'; // + this.seasonId;
    return this._http.get<Division[]>(this._divisionUrl).pipe(
      // map((response: Response) => <Division[]>),
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', []))
    );
  }
  getSelectedSeasonDivisions() {
    this.selectedSeason$.subscribe(season => {
      return this._http.get<Division[]>(this.divisionUrl + season);
      tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.dataService.handleError('getSeasonDivisions', null));
    });
  }
  division(id: number): Observable<Division> {
    console.log('Getting divisions');
    return this.getSeasonDivisions(of(this.season)).pipe(
      map((content: Division[]) => content.find(p => p.divisionID === id))
    );
  }
}
