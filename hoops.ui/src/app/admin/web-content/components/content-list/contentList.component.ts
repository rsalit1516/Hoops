import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'csbc-content-list',
  standalone: true,
  templateUrl: './contentList.component.html',
  styleUrls: [ './contentList.component.scss', '../../../admin.component.scss', '../../../../shared/scss/tables.scss' ],
  imports: [ CommonModule, MatDialogModule, MatTableModule, MatIconModule,
    ContentListToolbarComponent ]
})
export class ContentListComponent implements OnInit {
  @Output() selectedContent = new EventEmitter<Content>();
  contents$!: Observable<WebContent[]>;
  errorMessage: string|undefined;
  pageTitle: string|undefined;
  public dialog!: MatDialog;
  displayedColumns = ['title', 'expirationDate', 'dateAndTime', 'location', 'actions'];
  dataSource!: MatTableDataSource<WebContent>;

  constructor(
    // private _contentService: ContentService,
    private router: Router,
    private store: Store<fromContent.State>
  ) {}

  ngOnInit() {
    this.pageTitle = 'Web Site Messages';

    this.store.select(fromContent.getfilteredList).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  onSelect(content: Content): void {
    console.log(content);
  }

  editContent(content: Content) {
    this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.router.navigate(['./admin/content/edit']);
  }
  cloneContent(content: Content) {
    // this.store.dispatch(new contentActions.SetClonedContent(content));
    content.webContentId = undefined;
    this.store.dispatch(new contentActions.SetSelectedContent(content));

    this.router.navigate([ './admin/content/edit' ]);
  }

  addContent(): void {
    this.router.navigate(['./admin/content/edit']);
  }
}
