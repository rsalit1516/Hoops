import { delay, map, switchMap, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import {
  Injectable, Signal, WritableSignal, computed, effect, inject, signal,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../admin/state';
import { Constants } from '@app/shared/constants';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { setErrorMessage } from '@app/shared/error-message';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  /* dependency injection */
  // private constants = inject(Constants);
  #http = inject(HttpClient);
  #dataService = inject(DataService);
  #seasonService = inject(SeasonService);
  #store = inject(Store<fromAdmin.State>);
  selectedSeason = signal<Season | undefined>(undefined);
  selectedDivision = signal<Division | undefined>(undefined);
  updateSelectedDivision (division: Division) {
    this.selectedDivision.update(() => division);
  }
  _division = signal<Division>(new Division());
  get division () {
    return this._division;
  }

  updateDivision (division: Division) {
    this._division.set(division);
  }

  createTemporaryDivision (divisionName: string) {
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
    currentSeason: undefined,
    currentDivision: undefined,
    seasonDivisions: [],
    error: null,
  });
  private divisionUrl = Constants.SEASON_DIVISIONS_URL;

  private divisionResource = httpResource<DivisionResponse>(() =>
    `${ this.divisionUrl + this.selectedSeason()?.seasonId }`);

  vehicles = computed(() => this.divisionResource.value()?.results ?? [] as Division[]);
  error = computed(() => this.divisionResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Vehicle'));
  //  isLoading = this.divisionResource.isLoading;
  // selectors
  isLoading = computed(() => this.state().isLoading);
  currentSeason = computed(() => this.state().currentSeason);
  currentDivision = computed(() => this.state().currentDivision);
  seasonDivisions = computed(() => this.state().seasonDivisions);
  // error = computed(() => this.state().error);

  private selectedIdSubject = new Subject<Division>();


  private _season: Season | undefined;
  set season (value: Season | undefined) {
    this._season = value;
  }
  get season () {
    return this._season;
  }

  private _seasonId!: number;
  get seasonId () {
    return this._seasonId;
  }
  set seasonId (seasonId: number) {
    this._seasonId = seasonId;
  }
  // divisions: Division[];
  private selectedSeason$ = this.#store
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
    directorId: 0,
  });

  divisions: WritableSignal<Division[] | undefined> = signal<
    Division[] | undefined
  >(undefined);


  constructor () {
    this.#store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
      this.season = season;
      this.selectedSeason.update(() => season);
    });
    this.selectedIdSubject.pipe(
      // Set the loading indicator
      tap(() => this.setLoadingIndicator(true)),
      tap(division => this.setCurrent(division)),
      tap(division => console.log(division)),

      // switchMap(id => this.getDivisionsData(id)),
      // To better see the loading message
      delay(1000),
      // Ensure the observables are finalized when this service is destroyed
      takeUntilDestroyed()
    )
    //.subscribe(seasonDivisions => this.setSeasonDivisions(seasonDivisions));
  }
  setSeasonDivisions (seasonDivisions: Division[]): void {
    throw new Error('Method not implemented.');
  }
  setLoadingIndicator (isLoading: boolean): void {
    this.state.update(state => ({
      ...state,
      isLoading: isLoading
    }));
  }

  setCurrentDivision (id: number): void {
    console.log(id);
    const division = this.getCurrentDivisionById(id);
    this.state.update(state => ({
      ...state,
      currentDivision: division
    }));
    console.log(this.state());
  }
  setCurrent (division: Division): void {
    this.state.update(state => ({
      ...state,
      currentDivision: division
    }));
    console.log(this.state);
  }

  getDivisionsData (id: number): Observable<Division[]> {
    return this.#http
      .get<Division[]>(Constants.SEASON_DIVISIONS_URL + id)
      .pipe(catchError(() => of([])));
  }

  getDvision (division: Division) {
    this.selectedIdSubject.next(division);
  }

  getCurrentDivisionById (id: number) {
    let division = new Division();
    console.log(this.seasonDivisions());
    console.log(id);
    for (const item of this.seasonDivisions()) {
      console.log(item);
      if (item.divisionId === id) {
        division = item;
        console.log(division);
        return item;
      }
    }
    return division;
  }

  getSeasonDivisions (id: number) {
    return toSignal(this.getDivisionsData(id));
  }

  getSelectedSeasonDivisions () {
    this.#http.get<Division[]>(Constants.SEASON_DIVISIONS_URL + this.seasonId);
  }
  standardDivisions () {
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

  getDefaultDivision (name: string): Division {
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

  getDivisionMinDate (years: number): Date {
    let year = new Date().getFullYear() - years;
    let date = new Date('09/01/' + year);
    // console.log(date);
    // date.setFullYear(date.getFullYear() - years);
    return date;
  }
  getDivisionMaxDate (years: number): Date {
    let year = new Date().getFullYear() - years;
    let date = new Date('08/31/' + year);
    return date;
  }

  save (division: Division) {
    console.log(division);
    if (division.divisionId !== 0) {
      console.log('update');
      return this.#dataService.put<Division>(Constants.DIVISION_URL + '/' + division.divisionId, division);
      // .put<Division>(Constants.DIVISION_URL + '/' + division.divisionId, division)
      // .pipe(catchError(this.#dataService.handleError('saveDivision', division)));
    } else {
      console.log('post');
      return this.#dataService.post<Division>(Constants.DIVISION_URL, division);
      // .post<Division>(Constants.DIVISION_URL, division)
      // .pipe(catchError(this.#dataService.handleError('saveDivision', division)));
    }
  }

  getmatchingDivision (division: string): string {
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
  currentSeason: Season | undefined;
  currentDivision: Division | undefined;
  seasonDivisions: Division[];
  error: string | null;
}
export interface DivisionResponse {
  count: number;
  next: string;
  previous: string;
  results: Division[]
}
