
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import './data.service';

import { Content } from '../domain/content';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class WebContentService {
  public dataService = inject(DataService);
  // private _webContentUrl: string;
  private _webContentApi: '/api/WebContent' | undefined;
  constructor () { }

  /**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${ operation } failed: ${ error.message }`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  log (arg0: string) {
    throw new Error('Method not implemented.');
  }

}
