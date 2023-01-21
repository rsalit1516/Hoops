import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../../domain/content';
import { ContentService } from '../../content.service';

import * as fromContent from '../../state';
import * as contentActions from '../../state/content.actions';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'content-list-toolbar',
  templateUrl: './content-list-toolbar.component.html',
  styleUrls: ['./content-list-toolbar.component.scss', '../../../admin.component.scss']
})
export class ContentListToolbarComponent implements OnInit {
  checked = true;
  isActiveContent$ = this.store.select(fromContent.getIsActiveOnly);
  filterForm = this.fb.group({
    activeContent: async (params:boolean) => {
      this.isActiveContent$
}
  });


  constructor(
    private router: Router,
    private store: Store<fromContent.State>,
    private fb: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.isActiveContent$.subscribe(isActiveContent => {
      console.log(isActiveContent);
      this.fb.group({
        activeContent: isActiveContent
      });
      // this.filterForm.controls.activeContent.value(isActiveContent);
      // this.store.dispatch(new contentActions.SetIsActiveOnly(data));
      // isActiveContent ? this.store.dispatch(new contentActions.SetActiveContent()):
      // this.store.dispatch(new contentActions.SetAllContent());
    });
  }

  addContent() {
    const content = new Content();
    this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.router.navigate(['./admin/content/edit']);
  }
  filterContent() {
    const isActive = this.filterForm.value.activeContent !== true;
    console.log(isActive);
    // this.store.dispatch(new contentActions.SetIsActiveOnly(isActive));
    isActive
      ? this.store.dispatch(new contentActions.SetActiveContent())
      : this.store.dispatch(new contentActions.SetAllContent());
  }
}
