import {
  computed,
  inject,
  Inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { map, tap, shareReplay, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Season } from '../domain/season';
import { DataService } from './data.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  httpResource,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Constants } from '@app/shared/constants';
import { fromFetch } from 'rxjs/fetch';
import { getLocaleDateFormat } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeasonService {
  /* private injections */
  private http = inject(HttpClient);
  private dataService = inject(DataService);
  private seasonUrl = Constants.SEASON_URL + 'getCurrentSeason';
  private seasonsUrl = `${Constants.SEASON_URL}GetAll/${Constants.COMPANYID}`;

  // selectedSeason?: Season | null;
  season = signal(new Season());
  // public selectedSeason$: Observable<Season>;
  private _seasons: WritableSignal<Season[]> = signal([]);
  get seasons(): Season[] {
    return this._seasons();
  }
  updateSeasons(seasons: Season[]) {
    this._seasons.set(seasons);
  }

  seasons$ = this.http.get<Season[]>(this.seasonsUrl).pipe(
    // tap(data => console.log('All seasons: ' + JSON.stringify(data))),
    shareReplay(1)
    // catchError(this.dataService.handleError)
  );
  private _currentSeason = signal<Season | undefined>(undefined);
  currentSeason = signal<Season | undefined>(undefined);
  //   return this._currentSeason();
  // }
  updateCurrentSeason(season: Season) {
    this.currentSeason.set(season);
  }

  currentSeason$ = this.http.get<Season>(Constants.currentSeasonUrl).pipe(
    map((season) => season as Season),
    tap((data) => this._currentSeason.set(data)),
    tap((data) => this.updateSelectedSeason(data)),
    // tap(data => console.log('All: ' + JSON.stringify(data))),
    catchError(this.dataService.handleError('getCurrentSeason', null))
  );

  public getCurrentSeason(): Observable<Season | undefined> {
    return this.http.get<Season>(Constants.currentSeasonUrl);
  }
  fetchCurrentSeason(): void {
    this.getCurrentSeason().subscribe((season) => {
      this.updateCurrentSeason(season!);
      this.updateSelectedSeason(season!);
      console.log(this.selectedSeason);
    });
  }
  private _selectedSeason = signal<Season>(new Season());
  selectedSeason = signal<Season | undefined>(undefined);
  //   return this._selectedSeason();
  // }
  updateSelectedSeason(season: Season) {
    this.selectedSeason.set(season);
  }

  private seasonResource = httpResource<SeasonResponse>(
    () => `${Constants.currentSeasonUrl}`
  );
  vResource = httpResource<SeasonResponse>(() => Constants.currentSeasonUrl);
  season2 = computed(() => this.vResource.value()?.results ?? ([] as Season[]));
  season1 = computed(() => this.seasonResource.value()!.results);
  error = computed(() => this.seasonResource.error() as HttpErrorResponse);
  errorMessage = computed(() => console.log(this.error(), 'Season'));
  isLoading = computed(() => this.seasonResource.isLoading());
  seasonSaved = signal<boolean>(false);
  fetchSeasons(): void {
    this.getSeasons().subscribe({
      next: (seasons) => {
        this.updateSeasons(seasons);
      },
    });
  }
  private getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.seasonsUrl);
  }

  postSeason(season: Season): Observable<Season | null> {
    console.log('posting season');
    const payload = this.convertToSeasonApiFormat(season);
    return this.dataService.post<any>(
      Constants.SEASON_URL,
      payload
    ) as unknown as Observable<Season | null>;
  }

  putSeason(season: Season): Observable<Season> {
    console.log('putting season', season);
    const payload = this.convertToSeasonApiFormat(season);
    console.log(payload);

    const url = `${Constants.SEASON_URL}${season.seasonId}`;
    console.log(url);
    return this.dataService.put<any>(
      url,
      payload
    ) as unknown as Observable<Season>;
  }
  convertToSeasonApiFormat(season: Season): Record<string, any> {
    return {
      seasonId: season.seasonId,
      companyId: 1,
      description: season.description,
      fromDate: season.fromDate,
      toDate: season.toDate,
      participationFee: season.participationFee,
      sponsorFee: season.sponsorFee,
      convenienceFee: season.convenienceFee,
      currentSeason: season.currentSeason,
      currentSchedule: season.currentSchedule,
      currentSignUps: season.currentSignUps,
      signUpsDate: season.onlineStarts,
      signUpsEnd: season.onlineStops,
      testSeason: false,
      newSchoolYear: false,
      createdDate: new Date().toISOString(),
      createdUser: '',
    };
  }
}
export interface SeasonResponse {
  count: number;
  next: string;
  previous: string;
  results: Season;
}
