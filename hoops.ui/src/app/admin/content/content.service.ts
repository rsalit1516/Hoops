import { Injectable } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';

import * as moment from 'moment';

import { Content } from '../../domain/content';
import { DataService } from '../../services/data.service';
import { ConditionalExpr } from '@angular/compiler';

import * as fromContent from '../../admin/content/state';
import { Store } from '@ngrx/store';
import { WebContentType } from 'app/domain/webContentType';
import { WebContent } from '../../domain/webContent';
import { Observable, of } from 'rxjs';

@Injectable()
export class ContentService {
  private _selectedContent: any;
  selectedContent$!: Observable<any>;
  standardNotice = 1;

  public get selectedContent(): any {
    return this._selectedContent;
  }
  public set selectedContent(value: any) {
    this._selectedContent = value;
    this.selectedContent$ = of(value);
    console.log(value);
  }
  content$ = this.http.get<WebContent[]>(this.data.getContentUrl).pipe(
    tap((data) => console.log('All: ' + JSON.stringify(data))),
    shareReplay(1),
    catchError(this.data.handleError('getContents', []))
  );

  constructor(
    private http: HttpClient,
    public data: DataService,
    private store: Store<fromContent.State>
  ) {}

  getContents(): Observable<WebContent[]> {
    return this.http.get<WebContent[]>(this.data.getContentUrl).pipe(
      tap((data) => console.log('All: ' + JSON.stringify(data))),
      catchError(this.data.handleError('getContents', []))
    );
  }
  getActiveContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];

    this.store.select(fromContent.getContentList).subscribe((contents) => {
      console.log(contents);
      if (contents !== undefined) {
        const today = moment();
        // console.log(today);
        for (let i = 0; i < contents.length; i++) {
          const expirationDate = moment(contents[i].expirationDate);
          if (expirationDate >= today) {
            console.log(contents[i]);
            filteredContent.push(contents[i]);
          }
        }
      }
    });
    console.log(filteredContent);
    return of(filteredContent);
  }
  getAllContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];
    this.store.select(fromContent.getContentList).subscribe((contents) => {
      if (contents !== undefined) {
        for (let i = 0; i < contents.length; i++) {
          filteredContent.push(contents[i]);
        }
      }
    });
    return of(filteredContent);
  }

  getContent(webContentId: number) {
    console.log(webContentId);
    if (webContentId === 0) {
      return of(this.initializeContent());
      // return Observable.create((observer: any) => {
      //     observer.next(this.initializeProduct());
      //     observer.complete();
      // });
    }
    return this.http.get(this.data.getContentUrl).pipe(
      // map(this.extractData),
      tap((data) => console.log('getContent: ' + JSON.stringify(data))),
      catchError(this.data.handleError('getContent', []))
    );
  }

  // deleteContent(webContentId: number): Observable<Response> {
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   // To Do: add this back
  //   let options = { params: new HttpParams() };

  //   const url = `${this.baseUrl}/${webContentId}`;
  //   return this.http
  //     .delete(url, options)
  //     .pipe(
  //       tap(data => console.log('deleteContent: ' + JSON.stringify(data))),
  //       catchError(this.data.handleError('deleteContent', []))
  //     );
  // }

  saveContent(contentForm: any) {
    console.log(contentForm);
    let content = new Content();
    // content.webContentType = this.getWebContentType(
    //   contentForm.webContentType.Web
    // );
    content.webContentType = contentForm.webContentTypeControl;
    content.webContentId =
      contentForm.webContentId === null ? 0 : contentForm.webContentId;
    console.log(content);
    content.title = contentForm.title;
    content.subTitle = contentForm.subTitle;
    content.body = contentForm.body;
    content.dateAndTime = contentForm.dateAndTime;
    content.location = contentForm.location;
    content.expirationDate = contentForm.expirationDate;
    // content.webContentId = contentForm.webContentId;
    console.log(content);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: new HttpParams() };

    if (contentForm.webContentId === null) {
      return this.createContent(content, options.headers).subscribe((x) =>
        console.log(x)
      );
    } else {
      return this.updateContent(content, options.headers).subscribe((x) =>
        console.log(x)
      );
    }
  }

  private createContent(content: Content, options: HttpParams) {
    // content.webContentId = this.standardNotice;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(content);
    return this.http
      .post<WebContent>(
        this.data.postContentUrl,
        content,
        this.data.httpOptions
      )
      .pipe(catchError(this.data.handleError('addContent', content)));
  }

  private updateContent(content: Content, options: HttpParams) {
    // const url = `${this.baseUrl}/${content.webContentId}`;
    console.log(this.data.putContentUrl);
    console.log(content);
    return this.http
      .put<WebContent>(this.data.putContentUrl + content.webContentId, content, this.data.httpOptions)
      .pipe(
        tap((data) => console.log('updateContent: ' + JSON.stringify(data))),
        catchError(this.data.handleError('updateContent', content))
      );
  }

  private extractData(response: Response) {
    let body = ''; // response.json();
    console.log(response);
    // console.log(body);
    return body || {};
  }

  initializeContent(): Content {
    return {
      webContentId: 0,
      companyId: 1,
      title: '',
      subTitle: '',
      body: '',
      dateAndTime: '',
      location: '',
      expirationDate: new Date(),
      webContentTypeId: 1,
      contentSequence: 1,
      webContentType: new WebContentType(),
    };
  }
  getWebContentType(id: number): WebContentType {
    let webContentType = new WebContentType();
    console.log(id);
    switch (id) {
      case 1: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
        break;
      }
      case 2: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
        break;
      }
      case 3: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Meeting Notice';
        break;
      }
      default: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
      }
    }
    return webContentType;
  }
}
