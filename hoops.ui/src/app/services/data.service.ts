import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Constants } from '@app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  #http = inject(HttpClient);

  webUrl: string;
  baseUrl = Constants.DEFAULTURL;
  dotNetCoreUrl: string;
  getActiveWebContentUrl: string;
  // loginUrl = '${Constants.BASE_URL}/api/User/login';
  directorUrl = `${Constants.BASE_URL}/api/Director`;
  seasonGamesUrl = `${Constants.BASE_URL}/api/Schedulegame/getSeasonGames`;
  seasonDivisionsUrl = `${Constants.BASE_URL}/api/division/GetSeasonDivisions/`;
  playoffGameUrl = `${Constants.BASE_URL}/api/SchedulePlayoff/GetSeasonGames`;
  getCurrentSeasonUrl = `${Constants.BASE_URL}/api/season/getCurrentSeason`;
  getSeasonTeamsUrl = `${Constants.BASE_URL}/api/Team/GetSeasonTeams/`;
  getColorUrl = `${Constants.FUNCTIONS_BASE_URL}/api/color`;
  getLocationUrl = `${Constants.FUNCTIONS_BASE_URL}/api/location`;
  teamPostUrl = `${Constants.BASE_URL}/api/Team`;
  teamPutUrl = `${Constants.BASE_URL}/api/Team/`;
  getContentUrl = `${Constants.BASE_URL}/api/webcontent`;
  getActiveContentUrl = `${Constants.FUNCTIONS_BASE_URL}/api/webcontent/getActiveWebContent`;
  postContentUrl = `${Constants.BASE_URL}/api/WebContent`;
  getCurrentSponsors = `${Constants.BASE_URL}/api/Sponsor/GetSeasonSponsors/`;
  getLocations = `${Constants.BASE_URL}/api/Locations/`;
  // seasonUrl = `${Constants.BASE_URL}/api/Season/`;
  currentSeasonUrl = `${Constants.BASE_URL}/api/Season/GetCurrentSeason`;
  peopleUrl = `${Constants.BASE_URL}/api/People`;

  standingsUrl = '${Constants.BASE_URL}/api/ScheduleGame/getStandings';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  constructor() {
    this.webUrl = environment.apiUrl;
    this.dotNetCoreUrl = environment.apiUrl;
    this.getActiveWebContentUrl = `${Constants.FUNCTIONS_BASE_URL}/api/webcontent/getActiveWebContent`;
  }

  get(url: string, data: string) {
    return this.#http.get(url, this.httpOptions).pipe(
      tap((data) => {
        console.log('getContent: ' + JSON.stringify(data));
      }),
      catchError(this.handleError('get ', data))
    );
  }
  post<T>(url: string, data: T): Observable<T> {
    console.log(data);
    console.log(url);
    return this.#http.post<T>(url, data, this.httpOptions).pipe(
      tap((data) => console.log('PostContent: ' + JSON.stringify(data))),
      catchError(this.handleError('Error', data))
    );
  }
  put<T>(url: string, data: T): Observable<T> {
    console.log(url);
    console.log(data);
    // let url = this.data.putContentUrl + content.webContentId;
    return this.#http.put<T>(url, data, this.httpOptions);
    //.put<T>(url, data)
    // .pipe(
    //   tap((data) => console.log('updateContent: ' + JSON.stringify(data))),
    //   catchError((error) => {
    //     this.handleError('updateContent', data)(error);
    //     throw error;
    // };
    // );
  }

  //TODO:  Fix delete method
  delete(url: string) {
    console.log(url);
    return this.#http.delete(url, this.httpOptions).pipe(
      tap((data) => console.log('deleteContent: ' + JSON.stringify(data))),
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
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  log(arg0: string) {
    throw new Error('Method not implemented.');
  }
}
