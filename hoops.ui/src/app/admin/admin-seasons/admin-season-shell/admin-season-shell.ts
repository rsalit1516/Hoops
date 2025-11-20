import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';


import { RouterOutlet } from '@angular/router';
import { SeasonService } from '@app/services/season.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';


// import { SeasonAddEdit } from '@app/admin/components/season-add-edit/season-add-edit';

@Component({
  selector: 'csbc-admin-season-shell',
  template: `<section class="container-fluid">
    <h2>{{ title }}</h2>
    <router-outlet></router-outlet>
  </section>`,
  styleUrls: [
    './admin-season-shell.scss',
    '../../admin.scss',
    '../../containers/admin-shell/admin-shell.scss',
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/sidenav.scss',
  ],
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    ],
})
export class AdminSeasonShell implements OnInit, AfterViewInit {
  private store = inject<Store<fromAdmin.State>>(Store);

  private readonly seasonService = inject(SeasonService);
  pageTitle = 'Season Management';
  currentSeason$!: Observable<Season>;
  seasons$!: Observable<Season[]>;
  title = 'Seasons';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    effect(() => {
      const record = this.seasonService.selectedSeason();
      console.log('Selected record changed:', record);
      if (record) {
        console.log(`Record updated: ${record.description}`);
      }
    });
    effect(() => {
      const saved = this.seasonService.seasonSaved();
      console.log(saved);
      if (saved) {
        // this.isSidenavOpen = false;
        this.seasonService.seasonSaved.set(false);
      }
    });
  }

  ngOnInit() {
    // this.#seasonService.fetchSeasons();
    this.setStateSubscriptions();
  }
  ngAfterViewInit() {
    // Ensure the first panel expands when the sidenav opens
    // this.sidenav.openedStart.subscribe(() => {
    //   if (this.firstPanel) {
    //     this.firstPanel.expanded = true;
    //   }
    // });
  }
  setStateSubscriptions() {
    // this.currentSeason$ = this.store.pipe(select(fromAdmin.getCurrentSeason));
    // this.seasons$ = this.store.pipe(select(fromAdmin.getSeasons));
  }
  // closeSidenav() {
  //   this.isSidenavOpen = false;
  // }
}
