import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Season } from 'app/domain/season';
import { select, Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';


@Component({
  selector: 'csbc-admin-season-shell',
  templateUrl: './admin-season-shell.component.html',
  styleUrls: ['./admin-season-shell.component.scss']
})
export class AdminSeasonShellComponent implements OnInit {
  currentSeason$: Observable<Season>;
  seasons$: Observable<Season[]>;
  constructor(private store: Store<fromAdmin.State>) { }

  ngOnInit() {
    this.setStateSubscriptions();
  }
  setStateSubscriptions() {
    // this.currentSeason$ = this.store.pipe(select(fromAdmin.getCurrentSeason));
    this.seasons$ = this.store.pipe(select(fromAdmin.getSeasons));
  }
}
