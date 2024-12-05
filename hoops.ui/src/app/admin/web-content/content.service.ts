import { Injectable, WritableSignal, signal } from '@angular/core';
import { map, tap, shareReplay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';

import { Content } from '../../domain/content';
import { DataService } from '../../services/data.service';
import { ConditionalExpr } from '@angular/compiler';

import * as fromContent from '../state';
import * as contentActions from '../state/admin.actions';

import { Store } from '@ngrx/store';
import { WebContentType } from '@app/domain/webContentType';
import { WebContent } from '../../domain/webContent';
import { Observable, of } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
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
    // console.log(value);
  }
  content$ = this.http.get<WebContent[]>(this.data.getContentUrl).pipe(
    // tap((data) => console.log('All: ' + JSON.stringify(data))),
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
      tap((data) => {
        // this.store.dispatch(new contentActions.SetAllContent());
        // console.log('getContent: ' + JSON.stringify(data))
      }),
      catchError(this.data.handleError('getContents', []))
    );
  }

  contentsS: WritableSignal<WebContent[]> = signal([]);
  private test = this.content$.subscribe((data) => {
    this.contentsS.set(data);
    // console.log(this.contentsS);
  });

  getActiveContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];

    this.store.select(fromContent.getContentList).subscribe((contents) => {
      if (contents !== undefined) {
        const today = DateTime.now().toJSDate();
        for (let i = 0; i < contents.length; i++) {
          //console.log(contents[i].expirationDate);
          const exp = DateTime.fromISO(contents[i].expirationDate.toString());
          //console.log(exp);
          const ldateTime = DateTime.fromISO(contents[i].expirationDate.toString()).toJSDate();
          //console.log(ldateTime);
          if (ldateTime >= today) {
            //console.log(contents[i]);
            filteredContent.push(contents[ i ]);
            console.log(filteredContent);
          }
        }
      }
    });
    this.contentsS.set(filteredContent);
    //console.log(this.contentsS);
    console.log(filteredContent);
    return of(filteredContent);
  }

  getAllContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];
    console.log(filteredContent);
    this.store.select(fromContent.getContentList).subscribe((contents) => {
      if (contents !== undefined) {
        for (let i = 0; i < contents.length; i++) {
          filteredContent.push(contents[i]);
        }
      }
    });
    console.log(filteredContent);
    return of(filteredContent);
  }

  getContent (webContentId: number) {
    console.log(webContentId);
    if (webContentId === 0) {
      return of(this.initializeContent());
    }
    return this.http.get(this.data.getContentUrl).pipe(
      tap((data) => {
        this.store.dispatch(new contentActions.SetAllContent());
        // this.store.dispatch(new contentActions.SetActiveContent());
        console.log('getContent: ' + JSON.stringify(data))
  }),
      catchError(this.data.handleError('getContent', []))
    );
  }

  deleteContent(webContentId: number | null) {
    console.log('Deleting content');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    // To Do: add this back
    let options = { params: new HttpParams() };

    const url = `${this.data.getContentUrl}/${webContentId}`;
    return this.data.delete(url);
  }

  saveContent(data: Content) {
    console.log(data);
    let content = new Content();
    content.webContentTypeId = data.webContentTypeId;
    content.webContentId = data.webContentId === null ? 0 : data.webContentId;
    content.title = data.title;
    content.subTitle = data.subTitle;
    content.body = data.body;
    content.dateAndTime = data.dateAndTime;
    content.location = data.location;
    content.expirationDate = data.expirationDate;
    content.contentSequence = data.contentSequence;
    content.companyId = Constants.COMPANYID;

    if (data.webContentId === undefined) {
      return this.createContent(content).subscribe((x) => {
        // console.log(x)
        this.store.dispatch(new contentActions.LoadAdminContent());
      });
    } else {
      return this.updateContent(content).subscribe((x) => {
        console.log(x);
        this.store.dispatch(new contentActions.LoadAdminContent());
      });
    }
  }

  private createContent(content: Content): Observable<void | Content> {

    console.log(content);
    return this.data.post(content, this.data.postContentUrl).pipe(
      // tap((data) => console.log('createContent: ' + JSON.stringify(data))),
      map((data) => this.store.dispatch(new contentActions.LoadAdminContent())),
      catchError(this.data.handleError('createContent', content))
    );
  }

  private updateContent(content: Content) {
    console.log(this.data.putContentUrl);
    console.log(content);
    let url = this.data.putContentUrl + content.webContentId;
    console.log(url);
    return this.data.put<Content>(content, url);
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
    // console.log(id);
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
