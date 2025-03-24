import { Component, OnInit, WritableSignal, computed, effect, inject, input, signal } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Season } from '@app/domain/season';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AdminSeasonsToolbarComponent } from '../admin-seasons-toolbar/admin-seasons-toolbar.component';
import { Router } from '@angular/router';
import { SeasonService } from '@app/services/season.service';

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
  readonly #seasonService = inject(SeasonService);
  readonly #router = inject(Router);
  readonly #store = inject(Store<fromAdmin.State>);
  // private _seasons: WritableSignal<Season[] | undefined> = signal<Season[] | undefined>(undefined);
  // readonly info = input<string>();
  // get seasons() {
  //   return this._seasons();
  // }
  // set seasons(seasons: Season[] | undefined) {
  //   this._seasons.set(seasons);
  // }
seasons = computed(() => this.#seasonService.seasons());

  dataSource = new MatTableDataSource<Season>(this.seasons());

  displayColumns = [
    'seasonId',
    'description',
    'fromDate',
    'toDate',
  ];

  constructor() {

    effect(() => {
      this.dataSource.data = this.seasons()!;
      console.log(this.dataSource.data);
      console.log(this.seasons());
    });
  }

  ngOnInit() {
    this.setDisplayColumns();
    this.dataSource = new MatTableDataSource<Season>(this.seasons());

      // console.log(seasons);

  }
  setDisplayColumns() {
    this.displayColumns.push('seasonId');
    this.displayColumns.push('description');
    this.displayColumns.push('fromDate');
    this.displayColumns.push('toDate');
  }
  edit(row: Season) {
    console.log(row)
    this.#seasonService.selectSeason(row);
    // this.#store.dispatch(new adminActions.SetSelectedSeason(row));
    this.#router.navigate(['./admin/seasons/edit']);

  }
}
