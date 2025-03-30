import { Injectable, computed, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpParams,
  httpResource,
} from '@angular/common/http';

import { Content } from '../../domain/content';
import { DataService } from '../../services/data.service';

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
export class ContentService {
  readonly #http = inject(HttpClient);
  readonly data = inject(DataService);
  readonly store = inject(Store<fromContent.State>);

  // private _selectedContent: any;
  selectedContent$!: Observable<any>;
  standardNotice = 1;
  private _activeWebContent = signal<WebContent[]>([]);
  public get activeWebContent () {
    return this._activeWebContent;
  }
  updateActiveWebContent (value: WebContent[]) {
    this._activeWebContent.set(value);
  }
  allWebContent = signal<WebContent[]>([]);
  isActiveContent = signal<boolean>(true);
  selectedContent = signal<WebContent | undefined>(undefined);
  contents = signal<WebContent[]>([]);
  getContents (): Observable<WebContent[]> {
    return this.#http.get<WebContent[]>(this.data.getContentUrl);
  }
  fetchAllContents () {
    this.#http.get<WebContent[]>(this.data.getContentUrl).subscribe((data) => {
      this.allWebContent.update(() => data);
      this.contents.set(data);
    });
  }
  retrieveAllContents () {
    return httpResource<ContentResponse>(() =>
      `${ Constants.getContentUrl }`);
  }

  getActiveContent () {
    return this.#http.get<WebContent[]>(`${ Constants.getActiveWebContentUrl }`);
  }
  fetchActiveContents () {
    this.getActiveContent()
      .subscribe((data) => {
        console.log('fetchActiveContents: ' + JSON.stringify(data));
        this.updateActiveWebContent(data);
        console.log(this._activeWebContent());
      });
  }

  getAllContents (): Observable<WebContent[]> {
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
    return this.#http.get(this.data.getContentUrl).pipe(
      tap((data) => {
        // this.store.dispatch(new contentActions.SetAllContent());
        // this.store.dispatch(new contentActions.SetActiveContent());
        console.log('getContent: ' + JSON.stringify(data))
      }),
      catchError(this.data.handleError('getContent', []))
    );
  }
  private webContentResource = httpResource(() =>
    `${ Constants.getActiveWebContentUrl }`)

  activeWebContent2 = computed(() => this.webContentResource.value() as
    WebContent[]);
  deleteContent (webContentId: number | null) {
    console.log('Deleting content');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    // To Do: add this back
    let options = { params: new HttpParams() };

    const url = `${ this.data.getContentUrl }/${ webContentId }`;
    return this.data.delete(url);
  }

  saveContent (data: WebContent) {
    let content = new WebContent();
    content.webContentId = data.webContentId === null ? 0 : data.webContentId;
    content.companyId = Constants.COMPANYID;
    content.page = '';
    content.type = '';
    content.title = data.title;
    content.contentSequence = data.contentSequence;
    content.subTitle = data.subTitle;
    content.location = data.location;
    content.dateAndTime = data.dateAndTime;
    content.body = data.body;
    content.expirationDate = data.expirationDate;
    content.modifiedDate = DateTime.now().toJSDate();
    content.modifiedUser = 121; // To Do: get this from the user
    content.webContentTypeId = data.webContentTypeId === undefined ? 1 : data.webContentTypeId;

    // console.log(content);
    if (data.webContentId === undefined) {
      return this.createContent(content).subscribe((x) => {
        // console.log(x)
        this.store.dispatch(new contentActions.SetAllContent());
      });
    } else {
      return this.updateContent(content).subscribe((x) => {
        // console.log(x);
        this.store.dispatch(new contentActions.SetAllContent());
      });
    }
  }

  private createContent (content: WebContent): Observable<void | WebContent> {

    console.log(content);
    return this.data.post(this.data.postContentUrl, content).pipe(
      // tap((data) => console.log('createContent: ' + JSON.stringify(data))),
      map((data) => this.store.dispatch(new contentActions.LoadAdminContent())),
      catchError(this.data.handleError('createContent', content))
    );
  }

  private updateContent (content: WebContent): Observable<WebContent> {
    let url = Constants.PUT_CONTENT_URL + content.webContentId;
    console.log(url);
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.#http.put<WebContent>(url, content);

  }

  private extractData (response: Response) {
    let body = ''; // response.json();
    console.log(response);
    // console.log(body);
    return body || {};
  }

  initializeContent (): Content {
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
  getWebContentType (id: number): WebContentType {
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

export interface ContentResponse {
  count: number;
  next: string;
  previous: string;
  results: WebContent[]
}
