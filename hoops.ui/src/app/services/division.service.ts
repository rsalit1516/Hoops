import { catchError } from 'rxjs/operators';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import {
  Injectable,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { of, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../admin/state';
import { Constants } from '@app/shared/constants';
import { setErrorMessage } from '@app/shared/error-message';
import { LoggerService } from './logging.service';

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
  #logger = inject(LoggerService);
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  private _selectedDivision: WritableSignal<Division | undefined> = signal<
    Division | undefined
  >(undefined);
  // Expose as a readonly signal for consumers
  selectedDivision = this._selectedDivision.asReadonly();

  updateSelectedDivision(division: Division) {
    console.log(division);
    this._selectedDivision.set(division);
    // Persist last selected division for this season (client-side only)
    try {
      const seasonId = division.seasonId || this.seasonId || 0;
      if (seasonId) {
        localStorage.setItem(
          `games:lastDivision:${seasonId}`,
          String(division.divisionId ?? 0)
        );
      }
    } catch {}
  }

  _seasonDivisions: WritableSignal<Division[]> = signal([]);
  get seasonDivisions() {
    return this._seasonDivisions.asReadonly();
  }
  updateSeasonDivisions(seasonDivisions: Division[]) {
    this._seasonDivisions.set(seasonDivisions);
  }
  // seasonDivisions = signal<Division[] | undefined>(undefined);
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
    currentSeason: undefined,
    currentDivision: undefined,
    seasonDivisions: [],
    error: null,
  });
  seasonR = computed(() => this.#seasonService.season1);
  private divisionUrl = Constants.SEASON_DIVISIONS_URL;

  private divisionResource = httpResource<DivisionResponse>(
    () => `${this.divisionUrl + this.selectedSeason()?.seasonId}`
  );

  divisions = computed(
    () => this.divisionResource.value()?.results ?? ([] as Division[])
  );
  error = computed(() => this.divisionResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Vehicle'));
  //  isLoading = this.divisionResource.isLoading;
  // selectors
  isLoading = computed(() => this.state().isLoading);
  currentSeason = computed(() => this.state().currentSeason);
  currentDivision = computed(() => this.state().currentDivision);
  // seasonDivisions = computed(() => this.state().seasonDivisions);
  // error = computed(() => this.state().error);

  private selectedIdSubject = new Subject<Division>();

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
  // private selectedSeason$ = this.#store
  //   .pipe(select(fromAdmin.getSelectedSeason))
  //   .subscribe((season) => this.season == season);

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

  // divisions: WritableSignal<Division[] | undefined> = signal<
  //   Division[] | undefined
  // >(undefined);

  constructor() {
    effect(() => {
      const season = this.#seasonService.selectedSeason;
      if (season) {
        // Track the active season id for consumers that need it (e.g., editors on save)
        this.seasonId = season.seasonId ?? 0;
        this.season = season;
        this.getSeasonDivisions(this.seasonId);
        this.#logger.log(season);
        //     console.log(this.seasonDivisions());
      }
    });
    // this.#store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
    //   this.season = season;
    // });
    // this.selectedIdSubject.pipe(
    //   // Set the loading indicator
    //   tap(() => this.setLoadingIndicator(true)),
    //   tap(division => this.setCurrent(division)),
    //   tap(division => console.log(division)),

    // switchMap(id => this.getDivisionsData(id)),
    // To better see the loading message
    // delay(1000),
    // Ensure the observables are finalized when this service is destroyed
    //   takeUntilDestroyed()
    // )
    //.subscribe(seasonDivisions => this.setSeasonDivisions(seasonDivisions));
  }
  // setSeasonDivisions (seasonDivisions: Division[]): void {
  //   throw new Error('Method not implemented.');
  // }
  setLoadingIndicator(isLoading: boolean): void {
    this.state.update((state) => ({
      ...state,
      isLoading: isLoading,
    }));
  }

  setCurrentDivision(id: number): void {
    console.log(id);
    const division = this.getCurrentDivisionById(id);
    this.state.update((state) => ({
      ...state,
      currentDivision: division,
    }));
    console.log(this.state());
  }
  setCurrent(division: Division): void {
    this.state.update((state) => ({
      ...state,
      currentDivision: division,
    }));
    console.log(this.state);
  }

  getSeasonDivisions(id: number): void {
    const url = Constants.SEASON_DIVISIONS_URL + id;
    // this.#logger.log(url);
    this.#http.get<Division[]>(url).subscribe(
      (data) => {
        this.updateSeasonDivisions(data);
        // Try restoring previously selected division for this season
        let toSelect: Division | undefined = undefined;
        try {
          const stored = localStorage.getItem(`games:lastDivision:${id}`);
          if (stored) {
            const storedId = Number(stored);
            if (Number.isFinite(storedId)) {
              toSelect = data.find((d) => d.divisionId === storedId);
            }
          }
        } catch {}
        this.updateSelectedDivision(toSelect ?? data[0]);
        console.log(this.seasonDivisions());
      },
      (error) => {
        catchError(() => of([]));
      }
    );
  }

  getDivision(division: Division) {
    this.selectedIdSubject.next(division);
  }

  getCurrentDivisionById(id: number) {
    let division = new Division();
    console.log(this.seasonDivisions);
    console.log(id);
    for (const item of this.seasonDivisions()) {
      if (item.divisionId === id) {
        division = item;
        console.log(division);
        return item;
      }
    }
    return division;
  }

  // getSeasonDivisions (id: number) {
  //   return toSignal(this.getSeasonDivisions(id));
  // }

  getSelectedSeasonDivisions() {
    this.#http.get<Division[]>(Constants.SEASON_DIVISIONS_URL + this.seasonId);
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
    return date;
  }

  save(division: Division) {
    console.log(division);
    if (division.divisionId !== 0) {
      console.log('update');
      return this.#dataService.put<Division>(
        Constants.DIVISION_URL + '/' + division.divisionId,
        division
      );
      // .put<Division>(Constants.DIVISION_URL + '/' + division.divisionId, division)
      // .pipe(catchError(this.#dataService.handleError('saveDivision', division)));
    } else {
      console.log('post');
      return this.#dataService.post<Division>(Constants.DIVISION_URL, division);
      // .post<Division>(Constants.DIVISION_URL, division)
      // .pipe(catchError(this.#dataService.handleError('saveDivision', division)));
    }
  }

  delete(id: number) {
    const url = `${Constants.DIVISION_URL}/${id}`;
    return this.#dataService.delete(url);
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
  currentSeason: Season | undefined;
  currentDivision: Division | undefined;
  seasonDivisions: Division[];
  error: string | null;
}
export interface DivisionResponse {
  count: number;
  next: string;
  previous: string;
  results: Division[];
}
