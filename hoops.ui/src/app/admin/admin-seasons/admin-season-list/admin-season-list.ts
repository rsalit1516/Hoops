import {
  AfterViewInit,
  Component,
  OnInit,
  computed,
  inject,
  viewChild,
} from '@angular/core';

import { Season } from '@app/domain/season';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { SeasonsToolbar } from '../../components/seasons-toolbar/seasons-toolbar';
import { Router } from '@angular/router';
import { SeasonService } from '@app/services/season.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'csbc-admin-season-list',
  templateUrl: './admin-season-list.html',
  styleUrls: [
    './../../../shared/scss/tables.scss',
    './admin-season-list.scss',
    '../../admin.scss',
  ],
  imports: [
    MatTableModule,
    DatePipe,
    SeasonsToolbar,
    MatSortModule,
    MatPaginatorModule,
  ],
  providers: [MatSort, MatPaginator],
})
export class AdminSeasonList implements OnInit, AfterViewInit {
  readonly #seasonService = inject(SeasonService);
  readonly #router = inject(Router);
  readonly paginator = viewChild<MatPaginator>('seasonPaginator');
  readonly sort = viewChild(MatSort);
  showFirstLastButtons = true;
  pageSize = 10;
  seasons = computed(() => this.#seasonService.seasons);

  dataSource = new MatTableDataSource<Season>(this.seasons());

  displayColumns = ['seasonId', 'description', 'fromDate', 'toDate'];

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Season>(this.seasons());
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator() ?? null;
    this.dataSource.sort = this.sort() ?? null;
  }
  edit(row: Season) {
    this.#seasonService.updateSelectedSeason(row);
    console.log(row);
    // this.#store.dispatch(new adminActions.SetSelectedSeason(row));
    this.#router.navigate(['/admin/seasons/detail']);
  }
}
