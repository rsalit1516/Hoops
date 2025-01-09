import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Division } from '@app/domain/division';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Constants } from '@app/shared/constants';

@Injectable()
export class DataService {
  #http = inject(HttpClient);
  webUrl: string;
  baseUrl = Constants.DEFAULTURL;
  dotNetCoreUrl: string;
  getActiveWebContentUrl: string;
  loginUrl = this.baseUrl + '/api/User/login';
  directorUrl = this.baseUrl + '/api/Director';
  seasonGamesUrl = this.baseUrl + '/api/Schedulegame/getSeasonGames';
  seasonDivisionsUrl = this.baseUrl + '/api/division/GetSeasonDivisions/';
  playoffGameUrl = this.baseUrl + '/api/SchedulePlayoff/GetSeasonGames';
  getCurrentSeasonUrl = this.baseUrl + '/api/season/getCurrentSeason';
  getSeasonTeamsUrl = this.baseUrl + '/api/Team/GetSeasonTeams/';
  getColorUrl = this.baseUrl + '/api/Color';
  getLocationUrl = this.baseUrl + '/api/Location';
  teamPostUrl = this.baseUrl + '/api/Team';
  teamPutUrl = this.baseUrl + '/api/Team/';
  getContentUrl = this.baseUrl + '/api/webcontent';
  getActiveContentUrl = this.baseUrl + '/api/webcontent/getActiveWebContent';
  postContentUrl = this.baseUrl + '/api/WebContent';
  putContentUrl = this.baseUrl + '/api/WebContent/';
  getCurrentSponsors = this.baseUrl + '/api/Sponsor/GetSeasonSponsors/';
  getLocations = this.baseUrl + '/api/Locations/';
  seasonUrl = this.baseUrl + '/api/Season/';
  currentSeasonUrl = this.baseUrl + '/api/Season/GetCurrentSeason';
  peopleUrl = this.baseUrl + '/api/People';

  standingsUrl = this.baseUrl + '/api/ScheduleGame/getStandings';

  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  constructor () {
    this.webUrl = environment.apiUrl;
    this.dotNetCoreUrl = environment.apiUrl;
    this.getActiveWebContentUrl = this.dotNetCoreUrl + '/api/webcontent/getActiveWebContent';
  }

  get(url: string, data: string) {
    return this.#http
      .get(url, { headers: this.httpOptions })
      .pipe(
      tap((data) => {
        console.log('getContent: ' + JSON.stringify(data))
  }),
      catchError(this.handleError('get ', data))
    );
  }
  post<T> (url: string, data: T ): Observable<T> {
    console.log(data);
    console.log(url);
    return this.#http
      .post<T>(url, data, { headers: this.httpOptions })
      .pipe(
        tap((data) => console.log('PostContent: ' + JSON.stringify(data))),
        catchError(this.handleError('Error', data)));
  }
  put<T>(url: string, data: T ): Observable<T> {
    console.log(url);
    console.log(data);
    // let url = this.data.putContentUrl + content.webContentId;
    return this.#http
      .put<T>(url, data, { headers: this.httpOptions })
      // .pipe(
      //   tap((data) => console.log('updateContent: ' + JSON.stringify(data))),
      //   catchError((error) => {
      //     this.handleError('updateContent', data)(error);
      //     throw error;
      //   })
      // );
  }

    //TODO:  Fix delete method
  delete(url: string) {
    console.log(url);
    return this.#http
      .delete(url, { headers: this.httpOptions })
      .pipe(
        tap(data => console.log('deleteContent: ' + JSON.stringify(data))),
        // catchError(this.handleError('deleteContent', []))
        catchError(async (error) => console.error(error))

      );
    }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  log (arg0: string) {
    throw new Error('Method not implemented.');
  }
}
