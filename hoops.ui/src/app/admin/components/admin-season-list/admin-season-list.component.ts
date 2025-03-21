import { Component, OnInit, input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Season } from '@app/domain/season';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AdminSeasonsToolbarComponent } from '../admin-seasons-toolbar/admin-seasons-toolbar.component';
import { Router } from '@angular/router';

@Component({
    selector: 'csbc-admin-season-list',
    templateUrl: './admin-season-list.component.html',
    styleUrls: [
        './../../../shared/scss/tables.scss',
        './admin-season-list.component.scss',
        '../../admin.component.scss'
    ],
    imports: [MatTableModule, DatePipe,
        AdminSeasonsToolbarComponent,
    ]
})
export class AdminSeasonListComponent implements OnInit {
  private _seasons: Season[] | undefined;
  readonly info = input<string>();
  get seasons() {
    return this._seasons;
  }
  set seasons(seasons: Season[] | undefined) {
    this._seasons = seasons;
  }

  dataSource = new MatTableDataSource();

  displayColumns: string[];

  constructor(private router: Router, private store: Store<fromAdmin.State>) {
    this.displayColumns = [];
  }

  ngOnInit() {
    this.setDisplayColumns();

    this.store.dispatch(new adminActions.LoadSeasons());
    this.store.select(fromAdmin.getSeasons).subscribe(seasons => {
      this.seasons = seasons;
      // console.log(seasons);
      this.dataSource.data = seasons;
    });
  }
  setDisplayColumns() {
    this.displayColumns.push('seasonId');
    this.displayColumns.push('description');
    this.displayColumns.push('fromDate');
    this.displayColumns.push('toDate');
  }
  edit(row: Season) {
    console.log(row)
    this.store.dispatch(new adminActions.SetSelectedSeason(row));
    this.router.navigate(['./admin/seasons/edit']);

  }
}
