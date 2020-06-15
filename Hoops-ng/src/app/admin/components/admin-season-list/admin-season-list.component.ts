import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Season } from 'app/domain/season';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'csbc-admin-season-list',
  templateUrl: './admin-season-list.component.html',
  styleUrls: [
    './admin-season-list.component.scss',
    '../../admin.component.scss'
  ]
})
export class AdminSeasonListComponent implements OnInit {
  private _seasons: Season[];
  @Input()
  get seasons() {
    return this._seasons;
  }
  set seasons(seasons: Season[]) {
    this._seasons = seasons;
  }

  dataSource = new MatTableDataSource();

  displayColumns: string[];
  constructor(private store: Store<fromAdmin.State>) {}

  ngOnInit() {
    this.setDisplayColumns();

    this.store.dispatch(new adminActions.LoadSeasons());
    this.store.select(fromAdmin.getSeasons).subscribe(seasons => {
      this.seasons = seasons;
      console.log(seasons);
      this.dataSource.data = seasons;
    });
  }
  setDisplayColumns() {
    this.displayColumns = [];
    this.displayColumns.push('seasonID');
    this.displayColumns.push('description');
    this.displayColumns.push('fromDate');
    this.displayColumns.push('toDate');
  }
}
