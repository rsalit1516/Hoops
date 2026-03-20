import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { ContentService } from '../../../admin/web-content/content.service';

import { WebContent } from '../../../domain/webContent';
import { NgClass } from '@angular/common';
import { Announcement } from '../announcement/announcement';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-announcements',
  templateUrl: "./announcements.html",
  styleUrls: ['./announcements.scss'],
  imports: [Announcement, NgClass],
  providers: [ContentService]
})
export class CsbcAnnouncements implements OnInit {

  readonly contentService = inject(ContentService);
  private readonly logger = inject(LoggerService);
  // readonly #store = inject(Store<fromHome.State>);

  // Computed signal with active content already filtered by expiration date
  activeWebContent = computed(() => this.contentService.activeWebContent() ?? [] as WebContent[]);

  // Computed signal to further filter for Season Info and Event types
  webContent = computed(() => {
    const active = this.contentService.activeWebContent();
    return active.filter((c: WebContent) =>
      c.webContentTypeDescription === 'Season Info' ||
      c.webContentTypeDescription === 'Event'
    );
  });

  seasonInfoCount = 0 as number;
  latestNewsCount!: number;
  meetingNoticeCount!: number;
  errorMessage!: string;

  constructor () {
    effect(() => {
      this.logger.debug('Active web content:', this.contentService.activeWebContent());
      this.logger.debug('Filtered web content:', this.webContent());
    });
  }

  ngOnInit (): void {
    // Fetch all contents - active content is computed automatically
    this.contentService.fetchAllContents();
  }
  sortByContentSequence (a: { contentSequence: number; }, b: { contentSequence: number; }) {
    if (a.contentSequence < b.contentSequence)
      return -1;
    if (a.contentSequence > b.contentSequence)
      return 1;
    return 0;
  }

  getWebContent (): void {
    // this.activeWebContent = [];
    // this.#store.select(fromHome.getContent).subscribe(
    //   (webContents) => {
    //     if (webContents !== undefined) {
    //       const today = DateTime.now();
    //       console.log(webContents);
    //       for (let i = 0; i < webContents.length; i++) {
    //         // console.log(webContents[i]);
    //         this.activeWebContent.push(webContents[i]);
    //       }
    //     }
    //     // this.activeWebContent = webContents;
    //     console.log(this.activeWebContent);
    //   },
    //   (error) => (this.errorMessage = <any> error)
    // );
  }
  showNews (): boolean {
    return this.latestNewsCount > 0;
  }
  showSeasonInfo (): boolean {
    return this.seasonInfoCount > 0;
  }

  setImageClass (): string {
    if (this.showSidebar()) {
      return 'col-sm-9';
    } else {
      return 'col-sm-12 center-block';
    }
  }
  showSidebar (): boolean {
    return this.meetingNoticeCount > 0;
  }
  setSeasonInfoClass () {
    return 'col-8 offset-4 col-xs-12';
  }

  setSeasonListClass (): string {
    if (this.seasonInfoCount > 1) {
      return 'showMultiItemList';
    } else {
      return ''
    }
  }
}
