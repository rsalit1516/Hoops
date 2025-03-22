import { computed, inject, Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, tap, shareReplay, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Season } from '../domain/season';
import { DataService } from './data.service';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Constants } from '@app/shared/constants';
import { fromFetch } from 'rxjs/fetch';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  /* private injections */
  #http = inject(HttpClient);
  #dataService = inject(DataService);
  #seasonUrl = Constants.SEASON_URL + 'getCurrentSeason';
  #seasonsUrl = Constants.SEASON_URL + 'GetAll';

  // selectedSeason?: Season | null;
  season = signal(new Season());
  // public selectedSeason$: Observable<Season>;
  seasons = signal<Season[] | undefined>(undefined);

  seasons$ = this.#http.get<Season[]>(this.#seasonsUrl).pipe(
    // tap(data => console.log('All seasons: ' + JSON.stringify(data))),
    shareReplay(1),
    // catchError(this.dataService.handleError)
  );
  currentSeason = signal<Season | undefined>(undefined);

  currentSeason$ =
    this.#http.get<Season>(Constants.currentSeasonUrl).pipe(
      map(season => season as Season),
      tap(data => this.currentSeason.set(data)),
      tap(data => this.selectSeason(data)),
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.#dataService.handleError('getCurrentSeason', null))
    );
  public getCurrentSeason (): Observable<Season | undefined> {
    return this.#http.get<Season>(Constants.currentSeasonUrl);
  }
  fetchCurrentSeason (): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getCurrentSeason().subscribe({
        next: (season) => {
          if (season) {
            this.currentSeason.set(season);
            this.selectSeason(season);
          }
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  private _selectedSeason = signal<Season>(new Season());

  get selectedSeason (): Season {
    return this._selectedSeason();
  }

  set selectedSeason (season: Season) {
    this._selectedSeason.update(() => season);
  }

  selectSeason (season: Season) {
    this.selectedSeason = season;
  }
  // toSignal (this.getCurrentSeason());
  // selectedSeason: WritableSignal<Season | undefined> = signal(undefined);
  private seasonResource = httpResource<SeasonResponse>(() =>
    `${ Constants.currentSeasonUrl }`);
  vResource = httpResource<SeasonResponse>(() => Constants.currentSeasonUrl);
  season2 = computed(() => this.vResource.value()?.results
    ?? [] as Season[]);
  season1 = computed(() => this.seasonResource.value()!.results);
  error = computed(() => this.seasonResource.error() as HttpErrorResponse);
  errorMessage = computed(() => console.log(this.error(), 'Season'));
  isLoading = computed(() => this.seasonResource.isLoading());

  getSeasons (): void {
    this.#http.get<Season[]>(this.#seasonsUrl).pipe(
      map(response => this.seasons.update(() => response as Season[])),
      tap(data => console.log('All: ' + JSON.stringify(this.seasons()))),
      catchError(this.#dataService.handleError('getSeasons', []))
    );
  }

  reloadSeasons () {
    // this.seasonResource.reload();
  }

  // getSeason(id: number): Observable<Season> {
  //   return this.getSeasons().pipe(
  //     map((season: Season[]) => season.find(p => p.seasonId === id) as Season)
  //   );
  // }

  postSeason (season: Season): Observable<Season | null> {
    console.log('posting season');
    return this.#dataService.post<Season>(Constants.SEASON_URL, season);
  }

  putSeason (season: Season): any {
    return this.#dataService.put<Season>(this.#dataService.seasonUrl, season);
  }

}
export interface SeasonResponse {
  count: number;
  next: string;
  previous: string;
  results: Season
}


