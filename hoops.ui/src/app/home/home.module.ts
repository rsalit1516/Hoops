import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContentService } from '../services/content.service';
import { HomeComponent } from './home.component';

import { HomeCenterComponent } from './components/home-center/home-center.component';
import { CsbcHomeSidebarComponent } from './components/home-sidebar/home-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/home.reducer';
import { EffectsModule } from '@ngrx/effects';
import { HomeEffects } from './state/home.effects';
import { MeetingComponent } from './components/meeting/meeting.component';
import { SponsorListingComponent } from './components/sponsor-listing/sponsor-listing.component';
import { SponsorListComponent } from './components/sponsor-list/sponsor-list.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsbcAnnouncementsComponent } from './components/announcements/announcements.component';

@NgModule({
    imports: [
    StoreModule.forFeature('home', reducer),
    EffectsModule.forFeature([HomeEffects]),
],
})
export class HomeModule { }
