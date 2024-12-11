import { Component, OnInit, output, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../../domain/content';

import * as fromContent from '../../../state';
import * as contentActions from '../../../state/admin.actions';
import { WebContent } from '../../../../domain/webContent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ContentListToolbarComponent } from '../content-list-toolbar/content-list-toolbar.component';
import { DateTime } from 'luxon';

@Component({
  selector: 'csbc-content-list',
  templateUrl: './contentList.component.html',
  styleUrls: [
    './contentList.component.scss',
    '../../../admin.component.scss',
    '../../../../shared/scss/tables.scss',
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    ContentListToolbarComponent,
  ],
})
export class ContentListComponent implements OnInit {
  router = inject(Router);
  store = inject(Store<fromContent.State>);
  readonly selectedContent = output<Content>();
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

  constructor() {}

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
    this.store.select(fromContent.getIsActiveOnly).subscribe((isActive) => {
      isActive ? this.applyFilter() : this.clearFilter();
    });
  }
  refreshData() {
    this.store.select(fromContent.getContentList).subscribe((data) => {
      this.data = data;
    });
  }
  editContent(content: Content) {
    this.store.dispatch(new contentActions.SetSelectedContent(content));
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
}
