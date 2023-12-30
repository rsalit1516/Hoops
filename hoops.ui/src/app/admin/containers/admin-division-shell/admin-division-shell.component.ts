import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { DivisionListComponent } from '../../division/divisionList.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';

@Component({
    selector: 'csbc-admin-division-shell',
    templateUrl: './admin-division-shell.component.html',
    styleUrls: [
        './admin-division-shell.component.scss',
        '../../admin.component.scss'
    ],
    standalone: true,
    imports: [SeasonSelectComponent, DivisionListComponent]
})
export class AdminDivisionShellComponent implements OnInit {
  constructor(private store: Store<fromAdmin.State>) {}

  ngOnInit() {
    this.store.dispatch(new adminActions.LoadSeasons());
  }
}
