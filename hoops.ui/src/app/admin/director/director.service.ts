import { Injectable } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Director } from '@app/domain/director';
// import * as fromDirector from './state';


@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  url: string;
  directors: Director[] | undefined;
  handleError: ((err: any, caught: Observable<any[]>) => never) | undefined;

  constructor(private dataService: DataService, private http: HttpClient
    // , private store: Store<fromDirector.DirectorState>
    ) {
    this.url = this.dataService.directorUrl;
  }

  getDirectors(): Observable<Director[]> {
    return this.http.get<Director[]>(this.url).pipe(
        map(response => this.directors = response),
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.dataService.handleError('getDirectors', []))
      );
  }
}
