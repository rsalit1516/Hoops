import { AfterViewInit, Component, OnInit, ViewChild, WritableSignal, computed, effect, inject, input, signal } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Season } from '@app/domain/season';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AdminSeasonsToolbarComponent } from '../admin-seasons-toolbar/admin-seasons-toolbar.component';
import { Router } from '@angular/router';
import { SeasonService } from '@app/services/season.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
      MatSortModule,
            MatPaginatorModule
          ],
          providers: [ MatSort, MatPaginator ],

})
export class AdminSeasonListComponent implements OnInit, AfterViewInit {
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
  @ViewChild('seasonPaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  showFirstLastButtons = true;
  pageSize = 10;
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
