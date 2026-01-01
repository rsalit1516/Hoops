import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient, httpResource } from '@angular/common/http';

import { Content } from '../../domain/content';
import { DataService } from '../../services/data.service';

import * as fromContent from '../state';

import { Store } from '@ngrx/store';
import { WebContentType } from '@app/domain/webContentType';
import { WebContent } from '../../domain/webContent';
import { Observable, of } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { DateTime } from 'luxon';
import { LoggerService } from '@app/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private readonly http = inject(HttpClient);
  readonly data = inject(DataService);
  readonly store = inject(Store<fromContent.State>);
  private readonly logger = inject(LoggerService);

  // private _selectedContent: any;
  selectedContent$!: Observable<any>;
  standardNotice = 1;
  private _activeWebContent = signal<WebContent[]>([]);
  public get activeWebContent() {
    return this._activeWebContent;
  }
  updateActiveWebContent(value: WebContent[]) {
    this._activeWebContent.set(value);
  }
  allWebContent = signal<WebContent[]>([]);
  isActiveContent = signal<boolean>(true);
  selectedContent = signal<WebContent | undefined>(undefined);
  contents = signal<WebContent[]>([]);
  getContents(): Observable<WebContent[]> {
    return this.http.get<WebContent[]>(this.data.getContentUrl);
  }
  fetchAllContents() {
    this.http.get<WebContent[]>(this.data.getContentUrl).subscribe((data) => {
      this.allWebContent.update(() => data);
      this.contents.set(data);
    });
  }
  retrieveAllContents() {
    return httpResource<ContentResponse>(() => `${Constants.getContentUrl}`);
  }

  getActiveContent() {
    return this.http.get<WebContent[]>(`${Constants.getActiveWebContentUrl}`);
  }
  fetchActiveContents() {
    this.getActiveContent().subscribe((data) => {
      this.logger.debug('Fetched active contents:', data);
      this.updateActiveWebContent(data);
      this.logger.debug('Active web content updated:', this._activeWebContent());
    });
  }

  getAllContents(): Observable<WebContent[]> {
    let filteredContent: WebContent[] = [];
    this.logger.debug('Getting all contents');
    this.store.select(fromContent.getContentList).subscribe((contents) => {
      if (contents !== undefined) {
        for (let i = 0; i < contents.length; i++) {
          filteredContent.push(contents[i]);
        }
      }
    });
    this.logger.debug('Filtered content:', filteredContent);
    return of(filteredContent);
  }

  getContent(webContentId: number) {
    this.logger.debug('Getting content with ID:', webContentId);
    if (webContentId === 0) {
      return of(this.initializeContent());
    }
    return this.http.get(this.data.getContentUrl).pipe(
      tap((data) => {
        // this.store.dispatch(new contentActions.SetAllContent());
        // this.store.dispatch(new contentActions.SetActiveContent());
        this.logger.debug('getContent result:', data);
      }),
      catchError(this.data.handleError('getContent', []))
    );
  }
  private webContentResource = httpResource(
    () => `${Constants.getActiveWebContentUrl}`
  );

  activeWebContent2 = computed(
    () => this.webContentResource.value() as WebContent[]
  );
  deleteContent(webContentId: number | null): Observable<unknown> {
    this.logger.info('Deleting content with ID:', webContentId);
    const url = `${this.data.getContentUrl}/${webContentId}`;
    return this.data.delete(url);
  }

  /**
   * Saves web content - creates new content (POST) or updates existing content (PUT).
   * Following the pattern from admin-household and admin-people modules.
   * @param content The web content to save
   * @returns Observable<WebContent> - allows component to handle success/error
   */
  saveContent(content: WebContent): Observable<WebContent> {
    // Ensure CompanyId is set
    if (!content.companyId) {
      content.companyId = Constants.COMPANYID;
    }

    // Set modification metadata
    content.modifiedDate = DateTime.now().toJSDate();
    content.modifiedUser = 121; // TODO: get this from authenticated user

    // Ensure default values for optional fields
    content.page = content.page ?? '';
    content.type = content.type ?? '';
    content.webContentTypeId = content.webContentTypeId ?? 1;

    if (content.webContentId && content.webContentId !== 0) {
      // Update existing content (PUT)
      const url = `${Constants.PUT_CONTENT_URL}${content.webContentId}`;
      this.logger.info('Updating content at URL:', url);
      return this.http.put<WebContent>(url, content).pipe(
        tap((response) => {
          this.logger.info('Content updated:', response);
        })
      );
    } else {
      // Create new content (POST)
      this.logger.info('Creating new content');
      return this.http.post<WebContent>(this.data.postContentUrl, content).pipe(
        tap((response) => {
          this.logger.info('Content created:', response);
        })
      );
    }
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

export interface ContentResponse {
  count: number;
  next: string;
  previous: string;
  results: WebContent[];
}
