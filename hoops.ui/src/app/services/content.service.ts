import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { WebContent } from '../domain/webContent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private _webContentUrl: string;
  getActiveContent$ = this._http.get<WebContent[]>(
    this.dataService.getActiveWebContentUrl
  );
  constructor(private _http: HttpClient, public dataService: DataService) {
    this._webContentUrl = this.dataService.getActiveWebContentUrl;
  }

  getContents(): Observable<WebContent[]> {
    return this._http
      .get<WebContent[]>(this.dataService.getActiveWebContentUrl);
  }

  // getContent(id: number): Observable<WebContent> {
  //   return this.getContents().pipe(
  //     map((content: WebContent[]) => content.find((p) => p.webContentId === id))
  //   );
  // }
}
