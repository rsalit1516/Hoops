import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../../domain/content';
import { ContentService } from '../../content.service';
import { ContentEditComponent } from '../content-edit/content-edit.component';

import * as fromContent from '../../state';
import * as contentActions from '../../state/content.actions';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { WebContent } from '../../../../domain/webContent';

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
  displayedColumns = ['title', 'expirationDate', 'dateAndTime', 'actions'];
  dataSource!: MatTableDataSource<WebContent>;
  constructor(
    private _contentService: ContentService,
    private router: Router,
    private store: Store<fromContent.State>
  ) {}

  ngOnInit() {
    this.pageTitle = 'Web Site Messages';

    // this.store.select(fromContent.getIsActiveOnly).subscribe(isActive => {
    //   if (isActive) {
    //     this.store.dispatch(new contentActions.SetActiveContent());
    //   } else {
    //     this.store.dispatch(new contentActions.SetAllContent());
    //   }
    // });

    this.store.select(fromContent.getfilteredList).subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
    });
  }

  onSelect(content: Content): void {
    console.log(content);
    //  this.selectedContent = content;
  }

  editContent(content: any) {
    console.log(content);
    this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.router.navigate(['./admin/content/edit']);
    // this._contentService.selectedContent = content;
  }
  addContent() {
    this.router.navigate(['./admin/content/edit']);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ContentEditComponent, {
      height: '600px',
      width: '700px'
    });
  }
}
