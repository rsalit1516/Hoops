import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../rxjs-extensions';

import { Content } from '../domain/content';
import { DataService } from './data.service';
import { error } from 'selenium-webdriver';
import { WebContent } from '../domain/webContent';

@Injectable()
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

  getContent(id: number): Observable<WebContent> {
    return this.getContents().pipe(
      map((content: WebContent[]) => content.find((p) => p.webContentId === id))
    );
  }
}
