import { Component, inject, input, OnInit } from '@angular/core';
import { Content } from '../../../domain/content';
import { ContentService } from '@app/admin/web-content/content.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromHome from '../../state';
import { WebContent } from '../../../domain/webContent';
import { MeetingComponent } from '../meeting/meeting.component';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'csbc-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss'],
  imports: [
    NgFor,
    MeetingComponent,
    AsyncPipe,
  ]
})
export class CsbcHomeSidebarComponent implements OnInit {
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

  constructor (
    private _webContentService: ContentService,
    private store: Store<fromHome.State>
  ) {
    this.boardMeetingMessage = 'Board Meeting';
  }

  ngOnInit () {
    // this.content$.subscribe((result) => console.log(result));
  }
}
