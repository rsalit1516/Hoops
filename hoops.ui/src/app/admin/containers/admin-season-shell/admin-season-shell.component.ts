import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { AdminSeasonListComponent } from '../../components/admin-season-list/admin-season-list.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminGamesRoutingModule } from '@app/admin/admin-games/admin-games-routing.module';
import { ContentEditComponent } from '@app/admin/web-content/components/content-edit/content-edit.component';
import { ContentListComponent } from '@app/admin/web-content/components/content-list/contentList.component';


@Component({
    selector: 'csbc-admin-season-shell',
    template: `<section class="container-fluid">
    <h2>{{title}}</h2>
    <router-outlet></router-outlet>
  </section>`,
    styleUrls: ['./admin-season-shell.component.scss'],
    imports: [CommonModule, AdminGamesRoutingModule,
        RouterOutlet, AdminSeasonListComponent]
})
export class AdminSeasonShellComponent implements OnInit {
  currentSeason$!: Observable<Season>;
  seasons$!: Observable<Season[]>;
  title = 'Seasons';

  constructor(private store: Store<fromAdmin.State>) { }

  ngOnInit() {
    this.setStateSubscriptions();
  }
  setStateSubscriptions() {
    // this.currentSeason$ = this.store.pipe(select(fromAdmin.getCurrentSeason));
    this.seasons$ = this.store.pipe(select(fromAdmin.getSeasons));
  }
}
