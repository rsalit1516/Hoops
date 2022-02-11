import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from '@app/domain/color';
import { DataService } from '@app/services/data.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private _http: HttpClient,
    public dataService: DataService,) { }

  getColors() {
    return this._http.get<Color[]>(this.dataService.getColorUrl).pipe(
      map((colors) => {
        return colors;
      }),
      catchError(this.dataService.handleError('getTeams', []))
    );

  }
}
