import { Component, computed, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { AdminSeasonListComponent } from '../../components/admin-season-list/admin-season-list.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminGamesRoutingModule } from '@app/admin/admin-games/admin-games-routing.module';
import { ContentEditComponent } from '@app/admin/web-content/content-edit/content-edit.component';
import { ContentListComponent } from '@app/admin/web-content/content-list/contentList.component';
import { SeasonService } from '@app/services/season.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdminSeasonDetailComponent } from '@app/admin/components/admin-season-detail/admin-season-detail.component';
import { AdminSeasonFilterComponent } from '@app/admin/components/admin-season-filter/admin-season-filter.component';


@Component({
  selector: 'csbc-admin-season-shell',
  template: `<section class="container-fluid">
    <h2>{{title}}</h2>
    <router-outlet></router-outlet>
  </section>`,
  styleUrls: [ './admin-season-shell.component.scss' ],
  imports: [ CommonModule, AdminGamesRoutingModule,
    RouterOutlet, AdminSeasonListComponent,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    AdminSeasonDetailComponent,
    AdminSeasonFilterComponent
  ]
})
export class AdminSeasonShellComponent implements OnInit {
  readonly #seasonService = inject(SeasonService);
  currentSeason$!: Observable<Season>;
  seasons$!: Observable<Season[]>;
  title = 'Seasons';
  selectedSeason = computed(() => this.#seasonService.selectedSeason);

  constructor(private store: Store<fromAdmin.State>) { }

  ngOnInit() {
    this.#seasonService.fetchSeasons();
    this.setStateSubscriptions();
  }
  setStateSubscriptions() {
    // this.currentSeason$ = this.store.pipe(select(fromAdmin.getCurrentSeason));
    // this.seasons$ = this.store.pipe(select(fromAdmin.getSeasons));
  }
}
