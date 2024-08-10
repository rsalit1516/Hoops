import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, effect, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../admin/state';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  private divisionUrl =
    this.dataService.webUrl + '/api/division/GetSeasonDivisions/';

  private season: Season | undefined;
  private _seasonId!: number;
  get seasonId() {
    return this._seasonId;
  }
  set seasonId(seasonId: number) {
    this._seasonId = seasonId;
  }
  // divisions: Division[];
  private selectedSeason$ = this.store.pipe(select(fromAdmin.getSeasons));
  private currentDivision = signal<Division>({
    divisionId: 0,
    divisionDescription: '',
    minDate: new Date(),
    maxDate: new Date(),
    gender: 'M',
    minDate2: new Date(),
    maxDate2: new Date(),
    gender2: 'M',
    seasonId: 0
  });

  setCurrentDivision(division: Division): void {
    //this.currentDivision.set(division(
console.log(division);
    this.currentDivision.update(division => ({
      ...division as Division,
      divisionId: division.divisionId,
      divisionDescription: division.divisionDescription,
      minDate: division.minDate,
      maxDate: division.maxDate,
      gender: division.gender,
      // minDate2: division.minDate2,
      // maxDate2: division.maxDate2,
      // gender2: division.gender2,
    }));

    console.log(this.currentDivision());
  }

  getCurrentDivision(): Division {
    console.log(this.currentDivision());
    return this.currentDivision();
  }

  divisions = signal<Division[]>([]);
  // private _divisions$ = this._http
  //   .get<Division[]>(this.divisionUrl + this.selectedSeason$)
  //   .pipe(
  //     map(divisions =>
  //       divisions.map(
  //         division =>
  //           ({
  //             ...division
  //           } as Division)
  //       )
  //     ),
  //     tap(data => console.log('All: ' + JSON.stringify(data))),
  //     catchError(this.dataService.handleError('getSeasonDivisions', null))
  //   );
  divisions$ = this._http
    .get<Division[]>(this.divisionUrl + this.selectedSeason$)
    .pipe(
      map((divisions) => {
        divisions.map(
          (division) =>
            ({
              ...division,
            } as Division)
        ),
          this.divisions.set(divisions);
      }),
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', null))
    );

  // public set divisions$(value) {
  //   this._divisions$ = value;
  // }
  constructor(
    private _http: HttpClient,
    public dataService: DataService,
    public seasonService: SeasonService,
    private store: Store<fromAdmin.State>
  ) {
    // effect(() => {
    //   console.log(this.currentDivision());
    // });
  }

  getDivisions(seasonId: number): Observable<Division[]> {
    // console.log(seasonId);
    if (seasonId === undefined) {
      seasonId = 2202;
    }
    // this._divisionUrl =
    //   this.dataService.webUrl + '/api/division/GetSeasonDivisions/' + seasonId;
    return this._http.get<Division[]>(this.divisionUrl + seasonId).pipe(
      // map((response: Response) => <Division[]>),
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', []))
    );
  }

  getSeasonDivisions(season: Observable<Season>): Observable<Division[]> {
    // console.log(season);
    season.subscribe(
      (d) =>
        (this.divisionUrl =
          this.dataService.webUrl +
          '/api/division/GetSeasonDivisions/' +
          d.seasonId)
    );
    this.seasonId = 2193;
    if (season !== undefined) {
      if (this.season !== undefined && this.season.seasonId == undefined) {
        this.seasonId = 2193;
      } else {
        season.subscribe((s) => (this.seasonId = s.seasonId));
      }
    }
    if (this.seasonId === undefined) {
      this.seasonId = 2193;
    }
    this.divisionUrl =
      this.dataService.webUrl + '/api/division/GetSeasonDivisions/2083'; // + this.seasonId;
    return this._http.get<Division[]>(this.divisionUrl).pipe(
      // map((response: Response) => <Division[]>),
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', []))
    );
  }
  getSelectedSeasonDivisions() {
    this.selectedSeason$.subscribe((season) => {
      return this._http.get<Division[]>(this.divisionUrl + season);
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasonDivisions', null));
    });
  }
  // updateSelectedDivision(division: Division) {
  //   console.log(division);
  //   // this.currentDivision.set(division);
  // }
}
