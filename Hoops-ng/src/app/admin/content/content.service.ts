import { Injectable } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import * as moment from 'moment';

import { Content } from '../../domain/content';
import { DataService } from '../../services/data.service';
import { ConditionalExpr } from '@angular/compiler';

import * as fromContent from '../../admin/content/state';
import { Store } from '@ngrx/store';
import { WebContentType } from 'app/domain/webContentType';
import { WebContent } from '../../domain/webContent';

@Injectable()
export class ContentService {
  // private baseUrl = 'http://svc.csbchoops.net/api/WebContent';
  //baseUrl = this.data.webUrl;
  baseUrl = this.data.dotNetCoreUrl;
  getUrl = this.baseUrl + '/api/webcontent/getActiveWebContent';
  postUrl = this.baseUrl + '/api/webcontent';
  putUrl = this.baseUrl + '/api/webcontent';
  private _selectedContent: any;
  selectedContent$: Observable<any>;
  standardNotice = 1;

  public get selectedContent(): any {
    return this._selectedContent;
  }
  public set selectedContent(value: any) {
    this._selectedContent = value;
    this.selectedContent$ = of(value);
    console.log(value);
  }
  content$ = this.http.get<WebContent[]>(this.getUrl).pipe(
    // tap(data => console.log('All: ' + JSON.stringify(data))),
    shareReplay(1),
    catchError(this.data.handleError('getContents', []))
  );

  constructor(
    private http: HttpClient,
    public data: DataService,
    private store: Store<fromContent.State>
  ) {}

  getContents(): Observable<WebContent[]> {
    return this.http.get<WebContent[]>(this.getUrl).pipe(
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.data.handleError('getContents', []))
    );
  }
  getActiveContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];

    this.store.select(fromContent.getContentList).subscribe(contents => {
      console.log(contents);
      if (contents !== undefined) {
        const today = moment();
        // console.log(today);
        for (let i = 0; i < contents.length; i++) {
          // const expirationDate = moment(contents[i].expirationDate);
          // if (expirationDate >= today) {
            console.log(contents[i]);
            filteredContent.push(contents[i]);
          // }
        }
      }
    });
    console.log(filteredContent);
    return of(filteredContent);
  }
  getAllContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];
    this.store.select(fromContent.getContentList).subscribe(contents => {
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
    return this.http.get(this.getUrl).pipe(
      map(this.extractData),
      tap(data => console.log('getContent: ' + JSON.stringify(data))),
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
      return this.createContent(content, options.headers);
    } else {
      return this.updateContent(content, options.headers);
    }
  }

  private createContent(content: Content, options: HttpParams) {
    // content.webContentId = this.standardNotice;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(content);
    return this.http
      .post(this.postUrl, content, httpOptions)
      .subscribe(x => {});
    // return this.http
    //   .post(this.baseUrl, content) // , options)
    //   .pipe(
    //     map(this.extractData),
    //     tap(data => console.log('createContent: ' + JSON.stringify(data))),
    //     catchError(this.data.handleError('postContent', []))
    //   );
  }

  private updateContent(content: Content, options: HttpParams) {
    // const url = `${this.baseUrl}/${content.webContentId}`;
    console.log(this.putUrl);
    // content.webContentTypeId = 1;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(content);
    return this.http.put(this.postUrl, content, httpOptions).subscribe(x => {});
    // .pipe(
    //  //  map(() => content),
    //   tap(data => console.log('updateContent: ' + JSON.stringify(data))),
    //   catchError(this.data.handleError('updateContent', []))
    // );
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
      title: null,
      subTitle: null,
      body: null,
      dateAndTime: null,
      location: null,
      expirationDate: new Date(),
      webContentTypeId: 1,
      contentSequence: 1,
      webContentType: null
    };
  }
  getWebContentType(id: number): WebContentType {
    let webContentType = new WebContentType();
    console.log(id);
    switch (id) {
      case 1: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
      }
      case 2: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
      }
      case 3: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Meeting Notice';
      }
      default: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
      }
    }
    return webContentType;
  }
}
