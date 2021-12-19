import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throw';

import './data.service';

import { Content } from '../domain/content';
import { HttpClient } from 'selenium-webdriver/http';
import { of } from 'rxjs';

export class WebContentService {
    private _webContentUrl: string;
    private _webContentApi: '/api/WebContent';
    constructor(private _http: HttpClient, public DataService) {
     this._webContentUrl = this.DataService.webUrl + this._webContentApi;
 }

//   getWebContents(): Observable<Content[]> {
//         return this._http.get(this._webContentUrl)
//             .map((response: Response) => <Content[]> response.json())
//             .do(data => console.log('All: ' +  JSON.stringify(data)))
//             .catch(this.handleError);
//     }

    // getWebContent(id: number): Observable<Content> {
    //     return this.getWebContents()
    //         .map((webContent: Content[]) => webContent.find(p => p.webContentId === id));
    // }

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
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
    log(arg0: string) {
        throw new Error('Method not implemented.');
    }

}
