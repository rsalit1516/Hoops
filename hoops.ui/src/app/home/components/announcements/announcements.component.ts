import { Component, Input, OnInit, inject } from '@angular/core';

import { Content } from '../../../domain/content';
import { ContentService } from '../../../admin/web-content/content.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';

import * as fromHome from '../../state/';
//import * as homeActions from '../../state/home.actions';
import { map, tap, groupBy } from 'rxjs/operators';
import { WebContent } from '../../../domain/webContent';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from '../announcement/announcement.component';

@Component({
  selector: 'csbc-announcements',
  standalone: true,
  templateUrl: './announcements.component.html',
  styleUrls: [ './announcements.component.scss' ],
  imports: [ CommonModule, AnnouncementComponent ],
  providers: [ ContentService ]
})
export class CsbcAnnouncementsComponent implements OnInit {
@Input() info!: string;
  seasonInfoCount = 0 as number;
  latestNewsCount!: number;
  meetingNoticeCount!: number;
  activeWebContent!: WebContent[];
  errorMessage!: string;
  content$ = this.store.select(fromHome.getContent).pipe(
    map(result => result.filter(c => c.webContentTypeDescription === 'Season Info' || c.webContentTypeDescription === 'Event')),
    map(t => t.sort(this.sortByContentSequence))
  );
  _webContentService: ContentService;

  constructor(
    private store: Store<fromHome.State>
  ) {
    this._webContentService = inject(ContentService);

  }

  ngOnInit() {
  }

  sortByContentSequence(a: { contentSequence: number; },b: { contentSequence: number; }) {
    if (a.contentSequence < b.contentSequence)
      return -1;
    if (a.contentSequence > b.contentSequence)
      return 1;
    return 0;
  }
  getWebContent(): void {
    this.activeWebContent = [];
    this.store.select(fromHome.getContent).subscribe(
      (webContents) => {
        if (webContents !== undefined) {
          const today = moment();
          console.log(webContents);
          for (let i = 0; i < webContents.length; i++) {
              // console.log(webContents[i]);
              this.activeWebContent.push(webContents[i]);
          }
        }
        // this.activeWebContent = webContents;
        console.log(this.activeWebContent);
      },
      (error) => (this.errorMessage = <any>error)
    );
  }
  showNews(): boolean {
    return this.latestNewsCount > 0;
  }
  showSeasonInfo(): boolean {
    return this.seasonInfoCount > 0;
  }

  setImageClass(): string {
    if (this.showSidebar()) {
      return 'col-sm-9';
    } else {
      return 'col-sm-12 center-block';
    }
  }
  showSidebar(): boolean {
    return this.meetingNoticeCount > 0;
  }
  setSeasonInfoClass() {
    return 'col-8 offset-4 col-xs-12';
  }

  setNewsClass(): string {
    if (this.showSeasonInfo() || this.latestNewsCount > 0) {
      return 'col-sm-10 offset-sm-1 col-xs-12';
    } else {
      return 'col-sm-10 offset-sm-1 col-xs-12';
    }
  }
  setSeasonListClass(): string {
    if (this.seasonInfoCount > 1) {
      return 'showMultiItemList';
    } else
    {
      return ''
    }
  }
}
