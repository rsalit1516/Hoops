import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebContent } from '../domain/webContent';
import { Observable } from 'rxjs';
import { Constants } from '@app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  getActiveContent$ = this._http.get<WebContent[]>(Constants.getActiveContentUrl);

  constructor(private _http: HttpClient) {}

  getContents(): Observable<WebContent[]> {
    return this._http.get<WebContent[]>(Constants.getActiveContentUrl);
  }
}
