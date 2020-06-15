import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsorShellComponent } from './containers/sponsor-shell/sponsor-shell.component';
import { SponsorListComponent } from './components/sponsor-list/sponsor-list.component';
import { SponsorInfoComponent } from './components/sponsor-info/sponsor-info.component';
import { CurrentSeasonSponsorsComponent } from './components/current-season-sponsors/current-season-sponsors.component';

@NgModule({
  declarations: [SponsorShellComponent, SponsorListComponent, SponsorInfoComponent, CurrentSeasonSponsorsComponent],
  imports: [
    CommonModule
  ]
})
export class SponsorsModule { }
