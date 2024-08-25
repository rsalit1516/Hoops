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
import { Constants } from '@app/shared/constants';

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
  private selectedSeason$ = this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe( season => this.season == season);
  private currentDivision = signal<Division>({
    divisionId: 0,
    divisionDescription: '',
    minDate: new Date(),
    maxDate: new Date(),
    gender: 'M',
    minDate2: new Date(),
    maxDate2: new Date(),
    gender2: 'M',
    seasonId: 0,
    companyId: 1,
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
    this.getDefaultDivision(Constants.TR2COED);
    this.getDefaultDivision(Constants.TR4);
    this.getDefaultDivision(Constants.SIBOYS);
    this.getDefaultDivision(Constants.INTGIRLS);
    this.getDefaultDivision(Constants.JVGIRLS);
    this.getDefaultDivision(Constants.SJVBOYS);
    this.getDefaultDivision(Constants.HSGIRLS);
    this.getDefaultDivision(Constants.HSBOYS);
    this.getDefaultDivision(Constants.MEN);
    this.getDefaultDivision(Constants.WOMEN);
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
    this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe(season => {
      this.season = season;
      console.log(this.season);
    });
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
    this._http.get<Division[]>(this.divisionUrl + this.seasonId);
      // tap(data => console.log('All: ' + JSON.stringify(data))),
    //   catchError(this.dataService.handleError('getSeasonDivisions', null));
    // });
  }
  // updateSelectedDivision(division: Division) {
  //   console.log(division);
  //   // this.currentDivision.set(division);
  // }


  getDefaultDivision(name: string): Division {
    let division = new Division();
    division.companyId = 1;
    division.seasonId = this.season!.seasonId;

    switch (name) {
      case Constants.TR2COED: {
        division.divisionDescription = Constants.TR2COED;
        division.minDate = this.getDivisionMinDate(9);
        division.maxDate = this.getDivisionMaxDate(6);
        division.gender = 'M';
        division.minDate2 = this.getDivisionMinDate(9);
        division.maxDate2 = this.getDivisionMaxDate(6);
        division.gender2 = 'F';
        break
      }
      case Constants.TR4: {
        division.divisionDescription = Constants.TR4;
        division.minDate = this.getDivisionMinDate(11);
        division.maxDate = this.getDivisionMaxDate(9);
        division.gender = 'M';
        break;
      }
      case Constants.SIBOYS: {
        division.divisionDescription = Constants.SIBOYS;
        division.minDate = this.getDivisionMinDate(13);
        division.maxDate = this.getDivisionMaxDate(11);
        division.gender = 'M';
        break;
      }
      case Constants.INTGIRLS: {
        division.divisionDescription = Constants.INTGIRLS;
        division.minDate = this.getDivisionMinDate(13);
        division.maxDate = this.getDivisionMaxDate(11);
        division.gender = 'F';
        break;
      }
      case Constants.JVGIRLS: {
        division.divisionDescription = Constants.JVGIRLS;
        division.minDate = this.getDivisionMinDate(15);
        division.maxDate = this.getDivisionMaxDate(13);
        division.gender = 'F';
        break;
      }
      case Constants.SJVBOYS: {
        division.divisionDescription = Constants.SJVBOYS;
        division.minDate = this.getDivisionMinDate(17);
        division.maxDate = this.getDivisionMaxDate(15);
        division.gender = 'M';
        break;
      }
      case Constants.HSGIRLS: {
        division.divisionDescription = Constants.HSGIRLS;
        division.minDate = this.getDivisionMinDate(19);
        division.maxDate = this.getDivisionMaxDate(17);
        division.gender = 'F';
        break;
      }
      case Constants.HSBOYS: {
        division.divisionDescription = Constants.HSBOYS;
        division.minDate = this.getDivisionMinDate(19);
        division.maxDate = this.getDivisionMaxDate(17);
        division.gender = 'M';
        break;
      }
      case Constants.MEN: {
        division.divisionDescription = Constants.MEN;
        division.minDate = this.getDivisionMinDate(40);
        division.maxDate = this.getDivisionMaxDate(19);
        division.gender = 'M';
        break;
      }
      case Constants.WOMEN: {
        division.divisionDescription = Constants.WOMEN;
        division.minDate = this.getDivisionMinDate(40);
        division.maxDate = this.getDivisionMaxDate(19);
        division.gender = 'F';
        break;
      }
    }
    console.log(division);
    return division;
  }

  getDivisionMinDate(years: number): Date {
    let year = new Date().getFullYear() - years;
    let date = new Date('09/01/' + year);
    // console.log(date);
    // date.setFullYear(date.getFullYear() - years);
    return date;
  }
  getDivisionMaxDate(years: number): Date {
    let year = new Date().getFullYear() - years;
    let date = new Date('08/31/' + year);
    // console.log(date);
    return date;
  }
}
