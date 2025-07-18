import { AfterViewInit, Component, effect, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { AdminSeasonListComponent } from '../admin-season-list/admin-season-list.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from '@app/services/season.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminSeasonDetailComponent } from '@app/admin/admin-seasons/admin-season-detail/admin-season-detail.component';
import { AdminSeasonFilterComponent } from '@app/admin/components/admin-season-filter/admin-season-filter.component';
import { ShellTitleComponent } from '@app/shared/components/shell-title/shell-title.component';
import { SeasonsToolbarComponent } from '@app/admin/components/seasons-toolbar/seasons-toolbar.component';
import { SeasonAddEditComponent } from '@app/admin/components/season-add-edit/season-add-edit.component';


@Component({
  selector: 'csbc-admin-season-shell',
  template: `<section class="container-fluid">
    <h2>{{title}}</h2>
    <router-outlet></router-outlet>
  </section>`,
  styleUrls: ['./admin-season-shell.component.scss',
    '../../admin.component.scss',
    '../../containers/admin-shell/admin-shell.component.scss',
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/sidenav.scss',
  ],
  imports: [CommonModule,
    RouterOutlet,
    AdminSeasonListComponent,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    AdminSeasonDetailComponent,
    AdminSeasonFilterComponent,
    ShellTitleComponent,
    SeasonsToolbarComponent,
    AdminSeasonDetailComponent,
    SeasonAddEditComponent
  ]
})
export class AdminSeasonShellComponent implements OnInit, AfterViewInit {
  readonly #seasonService = inject(SeasonService);
  pageTitle = 'Season Management';
  currentSeason$!: Observable<Season>;
  seasons$!: Observable<Season[]>;
  title = 'Seasons';
  // selectedSeason = computed(() => this.#seasonService.selectedSeason);
  // isSidenavOpen = false;
  // @ViewChild('sidenav') sidenav!: MatSidenav;
  // @ViewChild('firstPanel') firstPanel!: MatExpansionPanel;

  constructor (private store: Store<fromAdmin.State>) {
    effect(() => {
      const record = this.#seasonService.selectedSeason;
      console.log('Selected record changed:', record);
      if (record !== null) {
        console.log(`Record updated: ${ record.description }`);
        // this.isSidenavOpen = true;
        // Allow the sidenav to open first, then expand the first panel
        // setTimeout(() => {
        //   if (this.firstPanel) {
        //     this.firstPanel.expanded = true;
        //   }
        // }, 300);
      }
    });
    effect(() => {
      const saved = this.#seasonService.seasonSaved();
      console.log(saved);
      if (saved) {
        // this.isSidenavOpen = false;
        this.#seasonService.seasonSaved.set(false);
      }
    });
  }

  ngOnInit () {
    // this.#seasonService.fetchSeasons();
    this.setStateSubscriptions();
  }
  ngAfterViewInit () {
    // Ensure the first panel expands when the sidenav opens
    // this.sidenav.openedStart.subscribe(() => {
    //   if (this.firstPanel) {
    //     this.firstPanel.expanded = true;
    //   }
    // });

  }
  setStateSubscriptions () {
    // this.currentSeason$ = this.store.pipe(select(fromAdmin.getCurrentSeason));
    // this.seasons$ = this.store.pipe(select(fromAdmin.getSeasons));
  }
  // closeSidenav() {
  //   this.isSidenavOpen = false;
  // }
}
