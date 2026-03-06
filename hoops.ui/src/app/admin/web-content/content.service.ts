import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

  selectedContent$!: Observable<any>;
  standardNotice = 1;

  // Single source of truth: all web content
  allWebContent = signal<WebContent[]>([]);

  // Computed signal: filter active content from allWebContent
  activeWebContent = computed(() => {
    const today = DateTime.now().startOf('day');
    return this.allWebContent().filter(content => {
      const expirationDate = DateTime.fromISO(content.expirationDate.toString());
      return expirationDate >= today;
    });
  });

  // UI state for showing active only
  isActiveContent = signal<boolean>(true);
  selectedContent = signal<WebContent | undefined>(undefined);

  /**
   * Fetches all web content from the API and updates the signal.
   * Active content is automatically computed from this.
   */
  fetchAllContents() {
    this.http.get<WebContent[]>(Constants.getContentUrl).subscribe((data) => {
      this.allWebContent.set(data);
      this.logger.debug('Fetched all contents:', data.length);
    });
  }

  /**
   * Returns an Observable of all web content.
   * Use this for one-time fetches or when you need an Observable.
   */
  getContents(): Observable<WebContent[]> {
    return this.http.get<WebContent[]>(Constants.getContentUrl);
  }

  /**
   * Gets a single content item by ID, or returns an initialized empty content if ID is 0.
   */
  getContent(webContentId: number): Observable<Content> {
    this.logger.debug('Getting content with ID:', webContentId);
    if (webContentId === 0) {
      return of(this.initializeContent());
    }
    return this.http.get<Content>(`${Constants.getContentUrl}/${webContentId}`).pipe(
      tap((data) => this.logger.debug('getContent result:', data)),
      catchError(this.data.handleError('getContent', this.initializeContent()))
    );
  }
  deleteContent(webContentId: number | null): Observable<unknown> {
    this.logger.info('Deleting content with ID:', webContentId);
    const url = `${Constants.getContentUrl}/${webContentId}`;
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
      return this.http.put<WebContent>(url, content, { withCredentials: true }).pipe(
        tap((response) => {
          this.logger.info('Content updated:', response);
        })
      );
    } else {
      // Create new content (POST)
      this.logger.info('Creating new content');
      return this.http.post<WebContent>(Constants.postContentUrl, content, { withCredentials: true }).pipe(
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
