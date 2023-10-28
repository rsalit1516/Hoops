import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../../domain/content';
import { ContentService } from '../../content.service';
import { ContentEditComponent } from '../content-edit/content-edit.component';

import * as fromContent from '../../state';
import * as contentActions from '../../state/content.actions';
import { WebContent } from '../../../../domain/webContent';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'csbc-content-list',
  templateUrl: './contentList.component.html',
  styleUrls: ['./contentList.component.scss', '../../../admin.component.scss']
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
    private _contentService: ContentService,
    private router: Router,
    private store: Store<fromContent.State>
  ) {}

  ngOnInit() {
    this.pageTitle = 'Web Site Messages';

    this.store.select(fromContent.getfilteredList).subscribe(data => {
      // console.log(data);
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
  openDialog(): void {
    const dialogRef = this.dialog.open(ContentEditComponent, {
      height: '600px',
      width: '700px'
    });
  }
}
