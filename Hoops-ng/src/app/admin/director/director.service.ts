import { Injectable } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
// import * as fromDirector from './state';


@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  url: string;
  directors: any;
  handleError: (err: any, caught: Observable<any[]>) => never;

  constructor(private dataService: DataService, private http: HttpClient
    // , private store: Store<fromDirector.DirectorState>
    ) {
    this.url = this.dataService.webUrl + '/api/director'
  }
  getDirectors(): Observable<any[]> {
    this.url = this.dataService.directorUrl;
    return this.http
      .get(this.url)
      .pipe(
        map(response => this.directors = response),
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
}
