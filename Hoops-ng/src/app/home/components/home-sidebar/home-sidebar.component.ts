import { Component, OnInit } from '@angular/core';
import { Content } from '../../../domain/content';
import { ContentService } from '../../../services/content.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromHome from '../../state';
import { WebContent } from '../../../domain/webContent';

@Component({
  selector: 'csbc-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss'],
})
export class CsbcHomeSidebarComponent implements OnInit {
  boardMeetingMessage: string;
  activeWebContent: WebContent[];
  errorMessage: string;
  // content = this._webContentService
  //   .getContents()
  //   .pipe(map((results) => results.filter((r) => r.webContentTypeId === 3)));
  content$ = this.store
    .select(fromHome.getContent)
    .pipe(map((result) => result.filter((c) => c.webContentTypeDescription === 'Meeting')),
    tap (result => console.log(result)));

  constructor(
    private _webContentService: ContentService,
    private store: Store<fromHome.State>
  ) {
    this.boardMeetingMessage = 'Board Meeting';
  }

  ngOnInit() {
    this.content$.subscribe((result) => console.log(result));
  }
}
