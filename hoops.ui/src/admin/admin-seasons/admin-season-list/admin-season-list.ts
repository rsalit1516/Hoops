import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';

import { Season } from '@app/domain/season';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { SeasonsToolbar } from '../../components/seasons-toolbar/seasons-toolbar';
import { Router } from '@angular/router';
import { SeasonService } from '@app/services/season.service';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { LoggerService } from '@app/services/logger.service';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../../shared/generic-mat-table/generic-mat-table';

@Component({
  selector: 'csbc-admin-season-list',
  templateUrl: './admin-season-list.html',
  styleUrls: [
    './../../../shared/scss/tables.scss',
    './admin-season-list.scss',
    '../../admin.scss',
  ],
  imports: [DatePipe, SeasonsToolbar, GenericMatTableComponent],
})
export class AdminSeasonList implements OnInit {
  readonly #seasonService = inject(SeasonService);
  readonly #router = inject(Router);
  private readonly logger = inject(LoggerService);
  private readonly prefs = inject(PaginationPreferencesService);
  @ViewChild('fromDateTemplate', { static: true })
  fromDateTemplate!: TemplateRef<unknown>;

  @ViewChild('toDateTemplate', { static: true })
  toDateTemplate!: TemplateRef<unknown>;

  columns: TableColumn<Season>[] = [
    { key: 'seasonId', header: 'ID', field: 'seasonId' },
    { key: 'description', header: 'Description', field: 'description' },
    { key: 'fromDate', header: 'From Date', template: this.fromDateTemplate },
    { key: 'toDate', header: 'To Date', template: this.toDateTemplate },
  ];

  pageSize = this.prefs.getPageSize(10);
  seasons = computed(() => this.#seasonService.seasons);

  dataSource = new MatTableDataSource<Season>(this.seasons());

  // React to seasons signal changes and update the table data (must run in injection context)
  private seasonsEffect = effect(() => {
    this.dataSource.data = this.seasons();
  });

  constructor() {}

  ngOnInit() {
    // Ensure we have fresh seasons when the list loads
    this.#seasonService.fetchSeasons();
    this.dataSource = new MatTableDataSource<Season>(this.seasons());
  }
  edit(row: Season) {
    this.#seasonService.updateSelectedSeason(row);
    this.logger.debug('Editing season:', row);
    // this.#store.dispatch(new adminActions.SetSelectedSeason(row));
    this.#router.navigate(['/admin/seasons/detail']);
  }
}
