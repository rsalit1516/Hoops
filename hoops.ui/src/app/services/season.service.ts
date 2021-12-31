import { Injectable } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import '../rxjs-extensions';

import { Season } from '../domain/season';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SeasonService {
  private _seasonUrl = this.dataService.webUrl + '/api/season/getCurrentSeason';
  private _seasonsUrl = this.dataService.webUrl + '/api/season/GetAll';
  public currentSeason!: Observable<Season>;
  // private selectedSeason = new Subject<Season>();
  selectedSeason: Season | undefined;
  public selectedSeason$: Observable<Season>;
  seasons: Season[] | undefined;
  seasons$ = this.http.get<Season[]>(this._seasonsUrl).pipe(
    // tap(data => console.log('All seasons: ' + JSON.stringify(data))),
    shareReplay(1),
    // catchError(this.dataService.handleError)
  );

  currentSeason$ =
  this.http.get<Season>(this._seasonUrl).pipe(
    map(season => season as Season),
    // tap(data => console.log('All: ' + JSON.stringify(data))),
    catchError(this.dataService.handleError('getCurrentSeason', null))
  );

  constructor(private http: HttpClient, public dataService: DataService) {

    // .currentSeason = this.getCurrent();
    this.selectedSeason$ = this.currentSeason;
    // this.currentSeason.toPromise()
    //   .then((result) => this.selectedSeason = result);
  }

  setSelectedSeason(season: Observable<Season>) {
    this.selectedSeason$ = season;
  }
  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this._seasonsUrl).pipe(
      map(response => this.seasons as Season[]),
      //     tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getSeasons', []))
    );
  }

  getSeason(id: number): Observable<Season> {
    return this.getSeasons().pipe(
      map((season: Season[]) => season.find(p => p.seasonId === id) as Season)
    );
  }

  // getCurrent(): Observable<Season> {
  //   return this.http.get<Season>(this._seasonUrl).pipe(
  //      map(response => {
  //        this.selectedSeason = response as Season;
  //        console.log(response);
  //       }),
  //     tap(data => (this.selectedSeason = data)),
  //     tap(data => console.log('All: ' + JSON.stringify(data))),
  //     catchError(this.dataService.handleError('getCurrentSeason', null))
  //   );
  // }
}
