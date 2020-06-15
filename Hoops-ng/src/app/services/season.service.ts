import { Injectable } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../rxjs-extensions';

import { Season } from '../domain/season';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SeasonService {
  private webUrl: string;
  private _seasonUrl = this.dataService.webUrl + '/api/season/getCurrentSeason';
  private _seasonsUrl = this.dataService.webUrl + '/api/season/GetAll';
  public currentSeason: Observable<Season>;
  // private selectedSeason = new Subject<Season>();
  selectedSeason: Season;
  public selectedSeason$: Observable<Season>;
  seasons: Season[];
  seasons$ = this.http.get<Season[]>(this._seasonsUrl).pipe(
    tap(data => console.log('All seasons: ' + JSON.stringify(data))),
    shareReplay(1),
    catchError(this.dataService.handleError)
  );

  currentSeason$: Observable<Season> = this.http.get<Season>(this._seasonUrl).pipe(
    map(season => season as Season),
    tap(data => console.log('All: ' + JSON.stringify(data))),
    catchError(this.dataService.handleError('getCurrentSeason', null))
  );

  constructor(private http: HttpClient, public dataService: DataService) {
    
    // .currentSeason = this.getCurrent();
    this.selectedSeason$ = this.currentSeason;
    // this.currentSeason.toPromise()
    //   .then((result) => this.selectedSeason = result);
  }

  setSelectedSeason(season: Observable<Season>) {
    console.log(season);
    this.selectedSeason$ = season;
  }
  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this._seasonsUrl).pipe(
      map(response => this.seasons),
      //     tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasons', []))
    );
  }

  getSeason(id: number): Observable<Season> {
    return this.getSeasons().pipe(
      map((season: Season[]) => season.find(p => p.seasonID === id))
    );
  }

  getCurrent(): Observable<Season> {
    return this.http.get<Season>(this._seasonUrl).pipe(
      //  map(response => {
      //    this.selectedSeason = response;
      //    console.log(response);
      //   }),
      tap(data => (this.selectedSeason = data)),
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getCurrentSeason', null))
    );
  }
}
