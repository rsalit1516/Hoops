import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../domain/content';

import * as fromContent from '../../state';
import * as contentActions from '../../state/admin.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ContentService } from '../content.service';

@Component({
    selector: 'content-list-toolbar',
    templateUrl: "./content-list-toolbar.html",
    styleUrls: ['./content-list-toolbar.scss',
        '../../admin.scss'],
  imports: [
    CommonModule,
    // MatFormFieldModule,
    // ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule]
})
export class ContentListToolbar implements OnInit {
  readonly #contentService = inject(ContentService);
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
    // this.isActiveContent$.subscribe(isActiveContent => {
    //   console.log(isActiveContent);
    //   this.store.dispatch(new contentActions.SetActiveContent());
    // });
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
this.#contentService.isActiveContent.set(checked);
    // this.store.dispatch(new contentActions.SetIsActiveOnly(checked));
  }
}
