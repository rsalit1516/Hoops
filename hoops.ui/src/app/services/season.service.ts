import { inject, Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Season } from '../domain/season';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Constants } from '@app/shared/constants';

@Injectable()
export class SeasonService {
  /* private injections */
  #http = inject(HttpClient);
  #dataService = inject(DataService);
  #seasonUrl = this.#dataService.seasonUrl + 'getCurrentSeason';
  #seasonsUrl = this.#dataService.seasonUrl + 'GetAll';

  // selectedSeason?: Season | null;
  season = signal(new Season());
  // public selectedSeason$: Observable<Season>;
  seasons: Season[] | undefined;
  seasons$ = this.#http.get<Season[]>(this.#seasonsUrl).pipe(
    // tap(data => console.log('All seasons: ' + JSON.stringify(data))),
    shareReplay(1),
    // catchError(this.dataService.handleError)
  );

  currentSeason$ =
  this.#http.get<Season>(this.#dataService.currentSeasonUrl).pipe(
    map(season => season as Season),
    // tap(data => console.log('All: ' + JSON.stringify(data))),
    catchError(this.#dataService.handleError('getCurrentSeason', null))
    );
  public getCurrentSeason(): Observable<Season | undefined> {
    return this.#http.get<Season>(this.#dataService.currentSeasonUrl);
  }
  currentSeason = toSignal(this.getCurrentSeason());
  selectedSeason: WritableSignal<Season | undefined> = signal(undefined);

  constructor() {}

  // setSelectedSeason(season: Observable<Season>) {
  //   this.selectedSeason$ = season;
  // }

  getSeasons(): Observable<Season[]> {
    return this.#http.get<Season[]>(this.#seasonsUrl).pipe(
      map(response => this.seasons = response as Season[]),
      tap(data => console.log('All: ' + JSON.stringify(this.seasons))),
      catchError(this.#dataService.handleError('getSeasons', []))
    );
  }

  getSeason(id: number): Observable<Season> {
    return this.getSeasons().pipe(
      map((season: Season[]) => season.find(p => p.seasonId === id) as Season)
    );
  }

  postSeason(season: Season): Observable<Season | null> {
    console.log('posting season');
    return this.#dataService.post<Season>(Constants.seasonUrl, season );
  }

  putSeason(season: Season): any {
    return this.#dataService.put<Season>(this.#dataService.seasonUrl, season );
  }

}
