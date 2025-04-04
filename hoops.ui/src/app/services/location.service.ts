import { catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { Location as GymLocation } from '@app/domain/location';


@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _http = inject(HttpClient);
  private dataService = inject(DataService);
  private locationUrl = Constants.GET_LOCATION_URL;
  private _locations = signal<GymLocation[]>([]);
  get locations () {
    return this._locations;
  }
  updateLocations (locations: GymLocation[]) {
    this._locations.set(locations);
  }

  constructor () { }

  fetchLocations (): void {
    this.getLocations().subscribe((locations) => {
      this.updateLocations(locations);
      console.log('locations', locations);
    });
  }

  private getLocations (): Observable<GymLocation[]> {
    return this._http.get<GymLocation[]>(this.locationUrl).pipe(
      catchError(this.dataService.handleError('getLocations', []))
    );
  }
}
