import { Component, computed, inject, OnInit, output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { SeasonService } from './services/season.service';
import { ContentService } from './admin/web-content/content.service';
import { FeatureFlagService } from './shared/feature-flags';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
  imports: [SidenavListComponent,
    TopNavComponent, RouterOutlet,
    MatSidenavModule, MatNativeDateModule]
})
export class AppComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #contentService = inject(ContentService);
  readonly #seasonService = inject(SeasonService);
  readonly #featureFlags = inject(FeatureFlagService)
  public readonly sidenavToggle = output();
  title = 'CSBC Hoops';
  season = computed(() => this.#seasonService.selectedSeason);

  constructor () {
    this.#featureFlags.isEnabled('adminModule');
  }
  ngOnInit () {
    this.#seasonService.fetchCurrentSeason();
    this.#contentService.fetchActiveContents();
    this.#router.navigate([''])
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
