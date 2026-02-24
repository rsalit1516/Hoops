import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  get(url: string, data: string) {
    return this.#http.get(url, this.httpOptions).pipe(
      tap((data) => {
        this.#logger.info('getContent: ' + JSON.stringify(data));
      }),
      catchError(this.handleError('get ', data))
    );
  }
  post<T>(url: string, data: T): Observable<T> {
    this.#logger.debug('POST data:', data);
    this.#logger.debug('POST url:', url);
    return this.#http.post<T>(url, data, this.httpOptions).pipe(
      tap((data) => this.#logger.info('PostContent: ' + JSON.stringify(data))),
      catchError(this.handleError('Error', data))
    );
  }
  put<T>(url: string, data: T): Observable<T> {
    this.#logger.debug('PUT url:', url);
    this.#logger.debug('PUT data:', data);
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
    this.#logger.debug('DELETE url:', url);
    return this.#http.delete(url, this.httpOptions).pipe(
      tap((data) =>
        this.#logger.info('deleteContent: ' + JSON.stringify(data))
      ),
      // catchError(this.handleError('deleteContent', []))
      catchError(async (error) => {
        this.#logger.error('DELETE failed:', error);
        return error;
      })
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
      this.#logger.error(`${operation} failed`, error); // log to logger

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
