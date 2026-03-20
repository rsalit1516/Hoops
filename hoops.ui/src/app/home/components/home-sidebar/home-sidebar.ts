import { Component, inject, input, OnInit } from '@angular/core';
import { Content } from '../../../domain/content';
import { ContentService } from '@app/admin/web-content/content.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromHome from '../../state';
import { WebContent } from '../../../domain/webContent';
import { Meeting } from '../meeting/meeting';


@Component({
  selector: 'csbc-home-sidebar',
  templateUrl: "./home-sidebar.html",
  styleUrls: ['./home-sidebar.scss'],
  imports: [
    Meeting,
    ]
})
export class CsbcHomeSidebar implements OnInit {
  private _webContentService = inject(ContentService);
  private store = inject<Store<fromHome.State>>(Store);

  // content = input.required<WebContent[]>();
  readonly #contentService = inject(ContentService);
  boardMeetingMessage: string;
  activeWebContent: WebContent[] | undefined;
  errorMessage: string | undefined;
  content = this.#contentService.activeWebContent;
  // content = this._webContentService
  //   .getContents()
  //   .pipe(map((results) => results.filter((r) => r.webContentTypeId === 3)));
  content$ = this.store
    .select(fromHome.getContent)
    .pipe(map((result) => result.filter((c) => c.webContentTypeDescription === 'Meeting')),
      // tap (result => console.log(result)
    );

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor () {
    this.boardMeetingMessage = 'Board Meeting';
  }

  ngOnInit () {
    // this.content$.subscribe((result) => console.log(result));
  }
}
