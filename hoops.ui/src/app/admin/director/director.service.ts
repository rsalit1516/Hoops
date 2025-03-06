import { computed, inject, Injectable, signal } from '@angular/core';
import { DataService } from '@app/services/data.service';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Director } from '@app/domain/director';
// import * as fromDirector from './state';
import { Constants } from '@app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  url = Constants.GET_DIRECTOR_URL;
  private dataService = inject(DataService);
  private http = inject(HttpClient);
  directors: Director[] = [];
  //directors = signal<Director[] | null>(null);
  handleError: ((err: any, caught: Observable<any[]>) => never) | undefined;

  // constructor(private dataService: DataService, private http: HttpClient
  //   // , private store: Store<fromDirector.DirectorState>
  //   ) {

  // }

  directorsResource = httpResource<DirectorResponse>(() =>
    `${ this.url }`);

  directors1 = computed(() => this.directorsResource.value()?.results ?? [] as Director[]);
  error = computed(() => this.directorsResource.error() as HttpErrorResponse);
  // errorMessage = computed(() => setErrorMessage(this.error(), 'Vehicle'));
  isLoading = this.directorsResource.isLoading;

  getDirectors (): Observable<Director[]> {
    return this.http.get<Director[]>(this.url).pipe(
      map(response => {
        this.directors = response;
        return response;
      }),
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError<Director[]>('getDirectors', []))
    );
  }
}
export interface DirectorResponse {
  count: number;
  next: string;
  previous: string;
  results: Director[]
}
