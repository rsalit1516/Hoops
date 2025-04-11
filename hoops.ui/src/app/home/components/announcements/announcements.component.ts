import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ContentService } from '../../../admin/web-content/content.service';

import { WebContent } from '../../../domain/webContent';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { map } from 'rxjs';

@Component({
  selector: 'csbc-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  imports: [CommonModule, AnnouncementComponent],
  providers: [ContentService]
})
export class CsbcAnnouncementsComponent implements OnInit {

  readonly contentService = inject(ContentService);
  // readonly #store = inject(Store<fromHome.State>);

  activeWebContent = computed(() => this.contentService.activeWebContent ?? [] as WebContent[]);
  seasonInfoCount = 0 as number;
  latestNewsCount!: number;
  meetingNoticeCount!: number;
  errorMessage!: string;

  webContent = signal<WebContent[]>([]);
  contentResource = this.contentService.activeWebContent2;
  contents = computed(() => this.contentService.contents);
  // content = this.contentService.activeWebContent2;
  x: WebContent[] = [];
  getActiveContent () {

    return this.contentService.getActiveContent().pipe(
      map((result: WebContent[]) => result.filter((c: WebContent) => c.webContentTypeDescription === 'Season Info' || c.webContentTypeDescription === 'Event')),
      map((result: WebContent[]) => { this.x = result; return result; }));
  }

  constructor () {
    effect(() => {
      console.log(this.contentService.activeWebContent);
      // console.log(test);
      // this.content.update(() => test.value() as WebContent[]);
      // console.log(test.value());
      // console.log(test.value()?.next);
      this.webContent.update(() => this.contentService.contents());
      console.log(this.webContent());

    });
  }
  ngOnInit (): void {
    this.getActiveContent();
    this.contentService.fetchActiveContents();
    // this.contentService.getActiveContent()
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.webContent.update(() => data);
    //   });
    console.log(this.contents);
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

  setNewsClass (): string {
    if (this.showSeasonInfo() || this.latestNewsCount > 0) {
      return 'col-sm-10 offset-sm-1 col-xs-12';
    } else {
      return 'col-sm-10 offset-sm-1 col-xs-12';
    }
  }
  setSeasonListClass (): string {
    if (this.seasonInfoCount > 1) {
      return 'showMultiItemList';
    } else {
      return ''
    }
  }
}
