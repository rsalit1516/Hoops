import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../../domain/content';

import * as fromContent from '../../../state';
import * as contentActions from '../../../state/admin.actions';
import { UntypedFormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'content-list-toolbar',
    templateUrl: './content-list-toolbar.component.html',
    styleUrls: ['./content-list-toolbar.component.scss',
        '../../../admin.component.scss'],
  imports: [
    CommonModule,
    // MatFormFieldModule,
    // ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule]
})
export class ContentListToolbarComponent implements OnInit {
  checked = true;
  isActiveContent$ = this.store.select(fromContent.getIsActiveOnly);
  // filterForm = this.fb.group({
  //   activeContent: true
  // });
  isActive = signal<boolean>(true);
  activeLabel = 'Active Only';

  constructor(
    private router: Router,
    private store: Store<fromContent.State>,
    // private fb: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.isActiveContent$.subscribe(isActiveContent => {
      console.log(isActiveContent);
    });
  }

  addContent() {
    const content = new Content();
    this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.router.navigate(['./admin/content/edit']);
  }
  filterContent(checked: boolean) {
    // const isActive = this.filterForm.value.activeContent === true;
    this.isActive.set(checked);
    console.log(checked);
    this.store.dispatch(new contentActions.SetIsActiveOnly(checked));
  }
}
