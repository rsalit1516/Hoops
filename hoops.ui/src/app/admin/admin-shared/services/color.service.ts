import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Color } from '@app/domain/color';
import { DataService } from '@app/services/data.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  readonly #http = inject(HttpClient);
  readonly #dataService = inject(DataService);
  private _colors = signal<Color[]>([]);
  public get colors () {
    return this._colors;
  }
  public updateColors (value: Color[]) {
    this._colors.set(value);
  }
  constructor () { }


  getColors () {
    return this.#http.get<Color[]>(this.#dataService.getColorUrl).pipe(
      map((colors) => {
        return colors;
      }),
      catchError(this.#dataService.handleError('getTeams', []))
    );
  }
  fetchColors () {
    this.getColors().subscribe((colors) => {
      this.updateColors(colors);
      console.log(this.colors());
    });
  }
}
