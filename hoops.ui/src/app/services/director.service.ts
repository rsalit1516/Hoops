import { computed, inject, Injectable, signal } from '@angular/core';
import { DataService } from '@app/services/data.service';
import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Director } from '@app/domain/director';
// import * as fromDirector from './state';
import { Constants } from '@app/shared/constants';
import { rxResource } from '@angular/core/rxjs-interop';
import { fromFetch } from 'rxjs/fetch';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DirectorService {
  url = Constants.GET_DIRECTOR_URL;
  private dataService = inject(DataService);
  private http = inject(HttpClient);
  //  directors: Director[] = [];
  directorsSignal = signal<Director[] | null>(null);
  //directors = signal<Director[] | null>(null);
  handleError: ((err: any, caught: Observable<any[]>) => never) | undefined;

  directorsResource = httpResource<DirectorResponse>(() => `${this.url}`);

  directors = computed(() => {
    const value = this.directorsResource.value();
    console.log('Directors Resource Value:', value); // Log the value here
    return value;
  });
  error = computed(() => {
    const errorValue = this.directorsResource.error() as HttpErrorResponse;
    console.log('Directors Resource Error:', errorValue); // Log the error here
    return errorValue;
  });
  // errorMessage = computed(() => setErrorMessage(this.error(), 'Vehicle'));
  isLoading = this.directorsResource.isLoading;

  constructor() {
    // Fetch directors initially
    this.fetchDirectors();
  }

  fetchDirectors() {
    this.http.get<Director[]>(`${this.url}`).subscribe(
      (directors) => {
        this.directorsSignal.update(() => directors);
      },
      (error) => {
        console.error('Failed to load directors', error);
      }
    );
    this.directorsResource.reload();
  }

  update(item: Director) {
    // ToDo: implement update logic
    return this.http.put<Director>(`${this.url}${item.directorId}/`, item).pipe(
      tap((data) => console.log('Updated Director: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError<Director>('updateDirector'))
    );
  }
  create(item: Director) {
    return this.http.post<Director>(`${this.url}`, item).pipe(
      tap((data) => console.log('Created Director: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError<Director>('createDirector'))
    );
  }

  // dataResource = rxResource({
  //   // Request function that returns the current ID
  //   // request: () => ({ id: this.directorsSignal() }),
  //   request: () => ({}),
  //   // Loader function that fetches data using the current ID
  //   loader: ({ request }) =>
  //     fromFetch(this.url).pipe(
  //       switchMap(response => response.json())
  //     ),
  // });

  reloadDirectors() {
    this.directorsResource.reload();
  }

  // getDirectors (): Observable<Director[]> {
  //   return this.http.get<Director[]>(this.url).pipe(
  //     map(response => {
  //       this.directors = response;
  //       return response;
  //     }),
  //     tap(data => console.log('All: ' + JSON.stringify(data))),
  //     catchError(this.dataService.handleError<Director[]>('getDirectors', []))
  //   );
  // }
}
export interface DirectorResponse {
  count: number;
  next: string;
  previous: string;
  results: Director[];
}
