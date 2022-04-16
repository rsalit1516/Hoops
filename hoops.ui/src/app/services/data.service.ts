import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Division } from '@app/domain/division';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Constants } from '@app/shared/constants';

@Injectable()
export class DataService {
  webUrl: string;
  baseUrl = Constants.DEFAULTURL;
  dotNetCoreUrl: string;
  getActiveWebContentUrl: string;
  loginUrl = this.baseUrl + '/api/User/login';
  directorUrl = this.baseUrl + '/api/Director';
  seasonGamesUrl = this.baseUrl + '/api/Schedulegame/getSeasonGames';
  seasonDivisionsUrl = this.baseUrl + '/api/division/GetSeasonDivisions/';
  playoffGameUrl = this.baseUrl + '/api/schedulegame/getSeasonPlayoffGames';
  getCurrentSeasonUrl = this.baseUrl + '/api/season/getCurrentSeason';
  getSeasonTeamsUrl = this.baseUrl + '/api/Team/getSeasonTeams/';
  getColorUrl = this.baseUrl + '/api/Color';
  teamPostUrl = this.baseUrl + '/api/Team';
  teamPutUrl = this.baseUrl + '/api/Team/';
  getContentUrl = this.baseUrl + '/api/webcontent';
  getActiveContentUrl = this.baseUrl + '/api/webcontent/getActiveWebContent';
  postContentUrl = this.baseUrl + '/api/webcontent';
  putContentUrl = this.baseUrl + '/api/WebContent/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  constructor (private _http: HttpClient) {
    this.webUrl = environment.apiUrl;
    // this.webUrl = 'http://csbc-webapi.azurewebsites.net';
    // this.webUrl = 'https://apicsbc.azurewebsites.net';
    this.dotNetCoreUrl = environment.apiUrl;
    this.getActiveWebContentUrl = this.dotNetCoreUrl + '/api/webcontent/getActiveWebContent';
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
      // console.error(error); // log to console instead

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
