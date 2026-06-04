import {
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';

import { WebContent } from '../domain/webContent';
import { SponsorList } from './components/sponsor-list/sponsor-list';
import { CsbcAnnouncements } from './components/announcements/announcements';
import { CsbcHomeSidebar } from './components/home-sidebar/home-sidebar';
import { NgClass } from '@angular/common';
import { HomeCenter } from './components/home-center/home-center';
import { LoggerService } from '@app/services/logger.service';
import { ContentService } from '@app/admin/web-content/content.service';
import { SponsorService } from './sponsor.service';

@Component({
  selector: 'csbc-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [
    HomeCenter,
    NgClass,
    CsbcHomeSidebar,
    CsbcAnnouncements,
    SponsorList,
    NgClass
],
})
export class Home implements OnInit {
  logger = inject(LoggerService);
  readonly #contentService = inject(ContentService);
  readonly #sponsorService = inject(SponsorService);

  coverImage = 'images/sky.jpg';
  seasonInfoCount: number = 1;
  latestNewsCount: number = 0;
  meetingNoticeCount: number = 0;
  topImage = '../../assets/images/CSBCTopImage.jpg';
  errorMessage: string | undefined;
  activeWebContent = computed(() => this.#contentService.activeWebContent);
  meetingNotices: WebContent[] | undefined;

  showSidebar = false;
  showSponsors = computed(() => this.#sponsorService.sponsors().length > 0);
  imageClass = 'col-sm-8 offset-sm-2 col-12';
  meetingNoticeClass = 'col-sm-0 col-xs-0';
  announcementInfo: WebContent[] | undefined = [];

  constructor() {}

  ngOnInit(): void {
    this.setImageClass();
    this.#sponsorService.load();

    // this.#gameStore.select(fromGames.getCurrentSeason).subscribe((season) => {
    //   if (season?.seasonId !== 0) {
    //     this.#gameStore.select(fromGames.getDivisions).subscribe((divisions) => {
    //       if (divisions.length > 0) {
    //         this.#gameStore
    //           .select(fromGames.getCurrentDivision)
    //           .subscribe((division) => {
    // if (division === undefined || division.seasonId === 0) {
    //   console.log('about to dispatch');
    //   this.gameStore.dispatch(
    //     new gameActions.SetCurrentDivision(divisions[0])
    //   );
    //   // this.gameStore.dispatch(new gameActions.LoadFilteredTeams());
    // }
    //           });
    //       }
    //     });
    //   }
    // });

    // TO DO - get this from a service!
    // this.#store.select(fromHome.getSponsors).subscribe((sponsors) => {
    //   this.showSponsors = sponsors.length > 0;
    // });
  }

  showSeasonInfo(): boolean {
    return this.seasonInfoCount > 0;
  }

  setImageClass(): void {
    const results = this.meetingNotices!;
    // this.showSidebar = results.length > 0;
    // if (results.length > 0) {
    //   this.imageClass = 'col-sm-8 col-md-9 col-12';
    //   this.meetingNoticeClass = 'col-sm-4 col-md-3 col-12';
    // } else {
    //   this.imageClass = 'col-sm-8 offset-sm-2 col-12';
    //   this.meetingNoticeClass = 'col-0';
    // }
  }

  setSeasonInfoClass() {
    if (this.showNews()) {
      return 'col-sm-6 col-xs-12';
    } else {
      return 'col-sm-8 col-sm-offset-2 col-12';
    }
  }

  //   setMeetingNoticeClass(): void {
  //     if (this.showSidebar()) {
  //       return 'col-sm-3 col-xs-12';
  //     } else {
  //       return 'col-sm-0 col-xs-0';
  //     }
  //   }

  setSeasonListClass(): string {
    return this.seasonInfoCount > 1 ? 'showMultiItemList' : '';
  }

  setNewsClass(): string {
    return this.showSeasonInfo() || this.latestNewsCount > 0
      ? 'col-sm-6 col-sm-offset-0 col-xs-12'
      : 'col-sm-8 col-sm-offset-2  col-xs-12';
  }

  showNews(): boolean {
    return this.latestNewsCount > 0;
  }
}
