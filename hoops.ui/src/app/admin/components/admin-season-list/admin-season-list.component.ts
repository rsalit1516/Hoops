import { AfterViewInit, Component, OnInit, ViewChild, computed, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Season } from '@app/domain/season';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { SeasonsToolbarComponent } from '../seasons-toolbar/seasons-toolbar.component';
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
    SeasonsToolbarComponent,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [MatSort, MatPaginator],

})
export class AdminSeasonListComponent implements OnInit, AfterViewInit {
  readonly #seasonService = inject(SeasonService);
  readonly #router = inject(Router);
  @ViewChild('seasonPaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  showFirstLastButtons = true;
  pageSize = 10;
  seasons = computed(() => this.#seasonService.seasons);

  dataSource = new MatTableDataSource<Season>(this.seasons());

  displayColumns = [
    'seasonId',
    'description',
    'fromDate',
    'toDate',
  ];

  constructor () {
    // effect(() => {
    //   this.dataSource.data = this.seasons()!;
    // });
  }

  ngOnInit () {
    this.dataSource = new MatTableDataSource<Season>(this.seasons());
  }
  ngAfterViewInit () {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  edit (row: Season) {
    this.#seasonService.updateSelectedSeason(row);
    console.log(row);
    // this.#store.dispatch(new adminActions.SetSelectedSeason(row));
    this.#router.navigate(['./admin/seasons/edit']);

  }
}
