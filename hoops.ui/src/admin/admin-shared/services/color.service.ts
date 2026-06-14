import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Color } from '@app/domain/color';
import { Constants } from '@app/shared/constants';
import { DataService } from '@app/services/data.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  readonly #http = inject(HttpClient);
  readonly #dataService = inject(DataService);

  private _colors = signal<Color[]>([]);
  public get colors() {
    return this._colors;
  }
  public updateColors(value: Color[]) {
    this._colors.set(value);
  }

  private _adminColors = signal<Color[]>([]);
  public get adminColors() {
    return this._adminColors;
  }

  private _selectedColor = signal<Color | null>(null);
  public get selectedColor() {
    return this._selectedColor;
  }
  public setSelectedColor(color: Color | null) {
    this._selectedColor.set(color);
  }

  constructor() { }

  getColors() {
    return this.#http.get<Color[]>(Constants.getColorUrl).pipe(
      map((colors) => colors),
      catchError(this.#dataService.handleError('getColors', []))
    );
  }

  fetchColors() {
    this.getColors().subscribe((colors) => {
      this.updateColors(colors);
    });
  }

  fetchAdminColors() {
    this.#http.get<Color[]>(Constants.getAdminColorUrl).pipe(
      catchError(this.#dataService.handleError('fetchAdminColors', []))
    ).subscribe((colors) => {
      this._adminColors.set(colors);
    });
  }

  saveColor(color: Color): Observable<Color> {
    const payload: Color = { ...color, companyId: Constants.COMPANYID };
    if (!color.colorId) {
      return this.#http.post<Color>(Constants.colorUrl, payload).pipe(
        tap((saved) => {
          this._adminColors.update((list) =>
            [...list, saved].sort((a, b) => a.colorName.localeCompare(b.colorName))
          );
          this._selectedColor.set(saved);
        }),
        catchError(this.#dataService.handleError('saveColor', color))
      );
    } else {
      return this.#http.put<Color>(`${Constants.colorUrl}/${color.colorId}`, payload).pipe(
        tap((saved) => {
          this._adminColors.update((list) =>
            list.map((c) => (c.colorId === saved.colorId ? saved : c))
              .sort((a, b) => a.colorName.localeCompare(b.colorName))
          );
          this._selectedColor.set(saved);
        }),
        catchError(this.#dataService.handleError('saveColor', color))
      );
    }
  }
}
