import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ContentService } from './content.service';
import { HomeComponent } from './home.component';
import { HomeCenterComponent } from './components/home-center/home-center.component';
import { CsbcAnnouncementsComponent } from './components/announcements/announcements.component';
import { CsbcHomeSidebarComponent } from './components/home-sidebar/home-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/home.reducer';
import { EffectsModule } from '@ngrx/effects';
import { HomeEffects } from './state/home.effects';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { SponsorCarouselComponent } from './components/sponsor-carousel/sponsor-carousel.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from './home.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    NgbModule,
    StoreModule.forFeature('home', reducer),
    EffectsModule.forFeature([HomeEffects])
  ],
  declarations: [
    HomeComponent,
    HomeCenterComponent,
    CsbcAnnouncementsComponent,
    CsbcHomeSidebarComponent,
    AnnouncementComponent,
    MeetingComponent,
    SponsorCarouselComponent
  ],
  providers: [
     ContentService,
     HomeService
  ],

})
export class HomeModule { }
