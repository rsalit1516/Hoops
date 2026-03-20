import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContentService } from '../services/content.service';
import { Home } from './home';

import { HomeCenter } from './components/home-center/home-center';
import { CsbcHomeSidebar } from './components/home-sidebar/home-sidebar';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/home.reducer';
import { EffectsModule } from '@ngrx/effects';
import { HomeEffects } from './state/home.effects';
import { Meeting } from './components/meeting/meeting';
import { SponsorListing } from './components/sponsor-listing/sponsor-listing';
import { SponsorList } from './components/sponsor-list/sponsor-list';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsbcAnnouncements } from './components/announcements/announcements';

@NgModule({
    imports: [
    StoreModule.forFeature('home', reducer),
    EffectsModule.forFeature([HomeEffects]),
],
})
export class HomeModule { }
