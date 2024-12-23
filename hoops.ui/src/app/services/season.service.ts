import { Injectable, signal, WritableSignal } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Season } from '../domain/season';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SeasonService {
  private _seasonUrl = this.dataService.seasonUrl + 'getCurrentSeason';
  private _seasonsUrl = this.dataService.seasonUrl + 'GetAll';
  public currentSeason!: Observable<Season>;
  // private selectedSeason = new Subject<Season>();
  selectedSeason?: Season | null;
  season = signal(new Season());
  public selectedSeason$: Observable<Season>;
  seasons: Season[] | undefined;
  seasons$ = this.http.get<Season[]>(this._seasonsUrl).pipe(
    // tap(data => console.log('All seasons: ' + JSON.stringify(data))),
    shareReplay(1),
    // catchError(this.dataService.handleError)
  );

  currentSeason$ =
  this.http.get<Season>(this.dataService.currentSeasonUrl).pipe(
    map(season => season as Season),
    tap(data => console.log('All: ' + JSON.stringify(data))),
    catchError(this.dataService.handleError('getCurrentSeason', null))
  );

  constructor(private http: HttpClient, private dataService: DataService) {

    this.selectedSeason$ = this.currentSeason;
    // .currentSeason = this.getCurrent();
    // this.currentSeason.subscribe((s) =>
    //   this.selectedSeason = s);
  }

  setSelectedSeason(season: Observable<Season>) {
    this.selectedSeason$ = season;
  }

  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this._seasonsUrl).pipe(
      map(response => this.seasons = response as Season[]),
      tap(data => console.log('All: ' + JSON.stringify(this.seasons))),
      catchError(this.dataService.handleError('getSeasons', []))
    );
  }

  getSeason(id: number): Observable<Season> {
    return this.getSeasons().pipe(
      map((season: Season[]) => season.find(p => p.seasonId === id) as Season)
    );
  }


  postSeason(season: Season): Observable<Season | null> {
    console.log('posting season');
    return this.dataService.post<Season>(season, this.dataService.seasonUrl);

    // return this.http.post<Season>(this.dataService.seasonUrl,
    //   season,
    //   this.dataService.httpOptions);
      // // .pipe(
      // // map(season => season as Season),
      // // tap(data => console.log('All post: ' + JSON.stringify(data))),
      // // catchError(this.dataService.handleError('getCurrentSeason', null))
    // )
  }

  putSeason(season: Season): any {
    return this.dataService.put<Season>(season, this.dataService.seasonUrl);
    // return this.http.put<Season>(this.dataService.seasonUrl, season)
    //   .pipe(
    //     map(season => season as Season),
    //     tap(data => console.log('All put: ' + JSON.stringify(data))),
    //     catchError(this.dataService.handleError('getCurrentSeason', null))
    //   )
  }

}
