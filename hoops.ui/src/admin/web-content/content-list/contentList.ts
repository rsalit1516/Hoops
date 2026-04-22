import {
  Component,
  OnInit,
  output,
  inject,
  AfterViewInit,
  ViewChild,
  computed,
  effect,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../domain/content';

import * as fromContent from '../../state';
import * as contentActions from '../../state/admin.actions';
import { WebContent } from '../../../domain/webContent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ContentListToolbar } from '../content-list-toolbar/content-list-toolbar';
import { DateTime } from 'luxon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ContentService } from '../content.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-content-list',
  templateUrl: './contentList.html',
  styleUrls: [
    './contentList.scss',
    '../../admin.scss',
    '../../../shared/scss/tables.scss',
  ],
  imports: [
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    ContentListToolbar,
    MatSortModule,
    MatPaginatorModule,
    DatePipe
],
  providers: [MatSort, MatPaginator],
})
export class ContentList implements OnInit, AfterViewInit {
  router = inject(Router);
  store = inject(Store<fromContent.State>);

  readonly #contentService = inject(ContentService);
  private readonly logger = inject(LoggerService);
  private readonly prefs = inject(PaginationPreferencesService);

  readonly selectedContent = output<Content>();
  @ViewChild('contentPaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  allWebContent = computed(() => this.#contentService.allWebContent);
  showFirstLastButtons = true;
  pageSize = this.prefs.getPageSize(10);
  contents$!: Observable<WebContent[]>;
  errorMessage: string | undefined;
  pageTitle: string | undefined;
  public dialog!: MatDialog;
  displayedColumns = [
    'title',
    'expirationDate',
    'dateAndTime',
    'location',
    'actions',
  ];
  dataSource = new MatTableDataSource<WebContent>([]);
  data: WebContent[] = [];
  filterValue = '';

  constructor() {
    effect(() => {
      if (this.#contentService.isActiveContent()) {
        this.data = this.#contentService.activeWebContent();
      } else {
        this.data = this.#contentService.allWebContent();
      }
      this.dataSource.data = this.data;
      this.refreshData();
      this.logger.info(this.data);
    });
  }

  ngOnInit() {
    this.pageTitle = 'Web Site Messages';
    // Fetch fresh data every time the list is displayed
    // Active content is computed automatically from allWebContent
    this.#contentService.fetchAllContents();
    this.refreshData();
    this.dataSource = new MatTableDataSource<WebContent>(this.data);

    // Note: filterPredicate is no longer needed - filtering is done via computed signal
    this.dataSource.filterPredicate = (data: WebContent, filter: string) => {
      const today = DateTime.now().startOf('day').toJSDate();
      const expirationDateString = data.expirationDate.toString();
      const expirationDate = DateTime.fromISO(expirationDateString).toJSDate();
      const result = expirationDate >= today;
      // console.log(`Filtering ${data.expirationDate}: ${result}`);
      return result;
    };
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'expirationDate', start: 'desc', disableClear: false });
  }

  refreshData() {
    // this.store.select(fromContent.getContentList).subscribe((data) => {
    // this.data = data;
    this.dataSource._updateChangeSubscription();
    this.dataSource.disconnect();
    this.dataSource.connect();
  }
  editContent(content: WebContent) {
    // this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.#contentService.selectedContent.update(() => content);
    this.router.navigate(['./admin/content/edit']);
  }
  cloneContent(content: Content) {
    // this.store.dispatch(new contentActions.SetClonedContent(content));
    content.webContentId = undefined;
    this.store.dispatch(new contentActions.SetSelectedContent(content));

    this.router.navigate(['./admin/content/edit']);
  }

  addContent(): void {
    this.router.navigate(['./admin/content/edit']);
  }
  applyFilter(): void {
    this.dataSource.filter = 'apply';
  }

  clearFilter(): void {
    this.dataSource.filter = '';
  }

  onPage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.prefs.savePageSize(event.pageSize);
  }
}
