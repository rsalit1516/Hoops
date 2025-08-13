import { Component, OnInit, output, inject, AfterViewInit, ViewChild, computed, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../domain/content';

import * as fromContent from '../../state';
import * as contentActions from '../../state/admin.actions';
import { WebContent } from '../../../domain/webContent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ContentListToolbar } from '../content-list-toolbar/content-list-toolbar';
import { DateTime } from 'luxon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ContentService } from '../content.service';

@Component({
  selector: 'csbc-content-list',
  templateUrl: "./contentList.html",
  styleUrls: [
    './contentList.scss',
    '../../admin.scss',
    '../../../shared/scss/tables.scss',
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    ContentListToolbar,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [ MatSort, MatPaginator ],
})
export class ContentList implements OnInit, AfterViewInit {
  router = inject(Router);
  store = inject(Store<fromContent.State>);

  readonly #contentService = inject(ContentService);
  readonly selectedContent = output<Content>();
  @ViewChild('contentPaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  allWebContent = computed(() => this.#contentService.allWebContent);
  showFirstLastButtons = true;
  pageSize = 10;
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
      }
      else {
        this.data = this.#contentService.allWebContent();
      }
      this.dataSource.data = this.data;
      this.refreshData();
      console.log(this.data);
    });
  }

  ngOnInit() {
    this.pageTitle = 'Web Site Messages';
    this.refreshData();
    this.dataSource = new MatTableDataSource<WebContent>(this.data);

    this.dataSource.filterPredicate = (data: WebContent, filter: string) => {
      const today = DateTime.now().startOf('day').toJSDate();
      const expirationDateString = data.expirationDate.toString();
      const expirationDate = DateTime.fromISO(expirationDateString).toJSDate();
      const result = expirationDate >= today;
      // console.log(`Filtering ${data.expirationDate}: ${result}`);
      return result;
    };
    // this.store.select(fromContent.getIsActiveOnly).subscribe((isActive) => {
    //   isActive ? this.applyFilter() : this.clearFilter();
    // });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refreshData() {
    // this.store.select(fromContent.getContentList).subscribe((data) => {
    // this.data = data;
    this.dataSource._updateChangeSubscription();
    this.dataSource.disconnect()
    this.dataSource.connect();

  }
  editContent(content: WebContent) {
    // this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.#contentService.selectedContent.update(() => content);
    this.router.navigate([ './admin/content/edit' ]);
  }
  cloneContent(content: Content) {
    // this.store.dispatch(new contentActions.SetClonedContent(content));
    content.webContentId = undefined;
    this.store.dispatch(new contentActions.SetSelectedContent(content));

    this.router.navigate([ './admin/content/edit' ]);
  }

  addContent(): void {
    this.router.navigate([ './admin/content/edit' ]);
  }
  applyFilter(): void {
    this.dataSource.filter = 'apply';
  }

  clearFilter(): void {
    this.dataSource.filter = '';
  }
}
