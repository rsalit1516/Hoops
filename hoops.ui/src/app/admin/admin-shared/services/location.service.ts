import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Location } from '@app/domain/location';
import { DataService } from '@app/services/data.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _http = inject(HttpClient);
  dataService = inject(DataService);

  locations = signal<Location[]>([]);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  get() {
    return this._http.get<Location[]>(this.dataService.getLocationUrl).pipe(
      tap((locations) => {
        // console.log('All: ' + JSON.stringify(locations))
        this.locations.set(locations);
      }),

      catchError(this.dataService.handleError('getLocations', []))
    );
  }

  locations$ = this._http.get<Location[]>(this.dataService.getLocationUrl).pipe(
    map((locations) => {
      locations.map((locations) => ({ ...locations } as Location)),
        this.locations.set(locations);
    }),
    catchError(this.dataService.handleError('getLocations', null))
  );

}
