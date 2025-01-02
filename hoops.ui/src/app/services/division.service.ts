import { map, switchMap, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../admin/state';
import { Constants } from '@app/shared/constants';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  /* dependency injection */
  // private constants = inject(Constants);
  private _http = inject(HttpClient);
  private dataService = inject(DataService);
  private seasonService = inject(SeasonService);
  private store = inject(Store<fromAdmin.State>);

  _division = signal<Division>(new Division());
  get division() {
    return this._division;
  }

  updateDivision(division: Division) {
    this._division.set(division);
  }

  createTemporaryDivision(divisionName: string) {
    const division = this.getDefaultDivision(divisionName);
    console.log(division);
    // this.division.set(division);
    this.updateDivision(division);
    console.log(this.division());
    this.currentDivision;
  }

  // signal state initialization
  public state = signal<DivisionState>({
    isLoading: false,

    seasonDivisions: [],
    error: null,
  });
  currentDivision = signal<Division | undefined>(undefined);
  /* selectors */
  isLoading = computed(() => this.state().isLoading);
  // currentDivision = computed(() => this.state().currentDivision);
  seasonDivisions = computed(() => this.state().seasonDivisions);
  error = computed(() => this.state().error);

  private divisionUrl = Constants.SEASON_DIVISIONS_URL;

  private _season: Season | undefined;
  set season(value: Season | undefined) {
    this._season = value;
  }
  get season() {
    return this._season;
  }

  private _seasonId!: number;
  get seasonId() {
    return this._seasonId;
  }
  set seasonId(seasonId: number) {
    this._seasonId = seasonId;
  }
  // divisions: Division[];
  private selectedSeason$ = this.store
    .pipe(select(fromAdmin.getSelectedSeason))
    .subscribe((season) => this.season == season);

  private initializeDivision = signal<Division>({
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
    this.currentDivision.set(division);

    console.log(this.currentDivision());
    // this.getDefaultDivision(Constants.TR2COED);
    // this.getDefaultDivision(Constants.TR4);
    // this.getDefaultDivision(Constants.SIBOYS);
    // this.getDefaultDivision(Constants.INTGIRLS);
    // this.getDefaultDivision(Constants.JVGIRLS);
    // this.getDefaultDivision(Constants.SJVBOYS);
    // this.getDefaultDivision(Constants.HSGIRLS);
    // this.getDefaultDivision(Constants.HSBOYS);
    // this.getDefaultDivision(Constants.MEN);
    // this.getDefaultDivision(Constants.WOMEN);
  }
  divisions: WritableSignal<Division[] | undefined> = signal<
    Division[] | undefined
  >(undefined);

  getDivisionsData(): Observable<Division[]> {
    return this._http
      .get<Division[]>(this.divisionUrl + this.season!.seasonId)
      .pipe(
        tap((data) => {
          console.log(data);
        }),
        catchError(() => of([]))
      );
  }

  constructor() {
    this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
      this.season = season;
      console.log(this.season);
    });
  }

  getDivisions(seasonId: number): Observable<Division[]> {
    if (seasonId === undefined) {
      seasonId = 2202;
    }
    return this._http
      .get<Division[]>(this.divisionUrl + seasonId)
      .pipe(catchError(this.dataService.handleError('getSeasonDivisions', [])));
  }

  getSeasonDivisions(season: Observable<Season>): Observable<Division[]> {
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
        season.subscribe((s) => (this.seasonId = s.seasonId ?? 0));
      }
    }
    if (this.seasonId === undefined) {
      this.seasonId = 2193;
    }
    this.divisionUrl =
      this.dataService.webUrl + '/api/division/GetSeasonDivisions/2083'; // + this.seasonId;
    return this._http
      .get<Division[]>(this.divisionUrl)
      .pipe(catchError(this.dataService.handleError('getSeasonDivisions', [])));
  }
  getSelectedSeasonDivisions() {
    this._http.get<Division[]>(this.divisionUrl + this.seasonId);
  }
  standardDivisions() {
    return [
      Constants.TR2COED,
      Constants.TR4,
      Constants.SIBOYS,
      Constants.INTGIRLS,
      Constants.JVGIRLS,
      Constants.SJVBOYS,
      Constants.HSGIRLS,
      Constants.HSBOYS,
      Constants.MEN,
      Constants.WOMEN,
    ];
  }

  getDefaultDivision(name: string): Division {
    let division = new Division();
    division.companyId = 1;
    division.seasonId = this.season?.seasonId ?? 0;

    switch (name) {
      case Constants.TR2COED: {
        division.divisionDescription = Constants.TR2COED;
        division.minDate = this.getDivisionMinDate(9);
        division.maxDate = this.getDivisionMaxDate(6);
        division.gender = 'M';
        division.minDate2 = this.getDivisionMinDate(9);
        division.maxDate2 = this.getDivisionMaxDate(6);
        division.gender2 = 'F';
        break;
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
    // console.log(division);
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

  save(division: Division) {
    console.log(division);
  }
  getmatchingDivision(division: string): string {
    for (const item of this.standardDivisions()) {
      if (item.toLowerCase() === division.toLowerCase()) {
        return item;
      }
    }
    return 'Other';
  }
}

export interface DivisionState {
  isLoading: boolean;
  // currentDivision: Division | undefined;
  seasonDivisions: Division[];
  error: string | null;
}
