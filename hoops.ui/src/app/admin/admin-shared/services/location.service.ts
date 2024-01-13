import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@app/domain/location';
import { DataService } from '@app/services/data.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _http: HttpClient,
    public dataService: DataService,) { }

  get() {
    return this._http.get<Location[]>(this.dataService.getLocationUrl).pipe(
      map((locations) => {
        return locations;
      }),
      catchError(this.dataService.handleError('getLocations', []))
    );

  }
}
