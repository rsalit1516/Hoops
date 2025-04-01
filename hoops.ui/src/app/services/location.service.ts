import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Constants } from '@app/shared/constants';

import * as fromAdmin from '../admin/state';

@Injectable()
export class LocationService {
  private _http = inject(HttpClient);
  private dataService = inject(DataService);
  private store = inject(Store<fromAdmin.State>);

  private locationUrl = Constants.GET_LOCATION_URL;

  constructor () { }

  getLocations (): Observable<Location[]> {
    return this._http.get<Location[]>(this.locationUrl).pipe(
      catchError(this.dataService.handleError('getLocations', []))
    );
  }
}
