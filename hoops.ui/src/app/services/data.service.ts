import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Division } from '@app/domain/division';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
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

  constructor (private _http: HttpClient) {
    this.webUrl = environment.apiUrl;
    // console.log(environment.apiUrl);
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
