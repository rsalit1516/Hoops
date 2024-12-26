import { Component, OnInit } from '@angular/core';

import { Content } from '../domain/content';
import { ContentService } from '../services/content.service';
import { SeasonService } from '../services/season.service';
import * as fromHome from './state';
import * as homeActions from './state/home.actions';
import { Store, select } from '@ngrx/store';
import { map, count } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { WebContent } from '../domain/webContent';

import * as gameActions from '../games/state/games.actions';
import * as fromGames from '../games/state';
import { SponsorListComponent } from './components/sponsor-list/sponsor-list.component';
import { CsbcAnnouncementsComponent } from './components/announcements/announcements.component';
import { CsbcHomeSidebarComponent } from './components/home-sidebar/home-sidebar.component';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgClass } from '@angular/common';
import { HomeCenterComponent } from './components/home-center/home-center.component';

@Component({
    selector: 'csbc-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [
        HomeCenterComponent,
        NgClass,
        ExtendedModule,
        CsbcHomeSidebarComponent,
        CsbcAnnouncementsComponent,
        SponsorListComponent,
    ]
})
export class HomeComponent implements OnInit {
  coverImage: string;
  seasonInfoCount: number;
  latestNewsCount: number;
  meetingNoticeCount: number;
  topImage: string;
  errorMessage: string | undefined;

  activeWebContent: any[] | undefined;
  webContents: WebContent[] | undefined;
  //   currentSeason$ = this.seasonService.getCurrent();
  content$ = this.store.select(fromHome.getContent);
  showSidebar$ = of(true);
  meetingNotices$: Observable<WebContent[]> | undefined;

  showSidebar = false;
  showSponsors = false;
  imageClass = 'col-sm-8 offset-sm-2 col-12';
  meetingNoticeClass = 'col-sm-0 col-xs-0';
  announcementInfo = '';

  constructor(
    private _contentService: ContentService,
    private seasonService: SeasonService,
    private store: Store<fromHome.State>,
    private gameStore: Store<fromGames.State>
  ) {
    // this.store.dispatch(new homeActions.LoadContent);
    this.seasonInfoCount = 1;
    this.latestNewsCount = 0;
    this.meetingNoticeCount = 0;
    this.coverImage = 'images/sky.jpg';
    this.topImage = '../../assets/images/CSBCTopImage.jpg';
  }

  ngOnInit(): void {
    this.store.dispatch(new homeActions.LoadContent());
    this.meetingNotices$ = this.content$.pipe(
      map((results) =>
        results.filter((r) => r.webContentTypeDescription === 'Meeting')
      )
    );
    this.setImageClass();
    this.gameStore.dispatch(new gameActions.LoadCurrentSeason());
    this.gameStore.select(fromGames.getCurrentSeason).subscribe((season) => {
      if ((season?.seasonId !== 0) && (season?.seasonId !== undefined)) {
        this.store.dispatch(new homeActions.LoadSponsors());
        this.gameStore.dispatch(new gameActions.LoadDivisions());
        this.store.dispatch(new gameActions.LoadTeams());
        this.store.dispatch(new gameActions.LoadGames());
        // this.store.dispatch(new gameActions.LoadPlayoffGames());
      }
    });

    this.gameStore.select(fromGames.getCurrentSeason).subscribe((season) => {
      if (season?.seasonId !== 0) {
        this.gameStore.select(fromGames.getDivisions).subscribe((divisions) => {
          if (divisions.length > 0) {
            this.gameStore
              .select(fromGames.getCurrentDivision)
              .subscribe((division) => {
                // if (division === undefined || division.seasonId === 0) {
                //   console.log('about to dispatch');
                //   this.gameStore.dispatch(
                //     new gameActions.SetCurrentDivision(divisions[0])
                //   );
                //   // this.gameStore.dispatch(new gameActions.LoadFilteredTeams());
                // }
              });
          }
        });
      }
    });
    this.store.select(fromHome.getSponsors).subscribe((sponsors) => {
      this.showSponsors = sponsors.length > 0;
    });
  }

  showSeasonInfo(): boolean {
    return this.seasonInfoCount > 0;
  }

  setImageClass(): void {
    this.meetingNotices$!.subscribe((results) => {
      this.showSidebar = results.length > 0;
      if (results.length > 0) {
        this.imageClass = 'col-sm-8 col-md-9 col-12';
        this.meetingNoticeClass = 'col-sm-4 col-md-3 col-12';
      } else {
        this.imageClass = 'col-sm-8 offset-sm-2 col-12';
        this.meetingNoticeClass = 'col-0';
      }
    });
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
