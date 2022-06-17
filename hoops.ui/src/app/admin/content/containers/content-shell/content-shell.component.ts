import { Component, OnInit, Input } from '@angular/core';
import { Content } from 'app/domain/content';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ContentService } from '../../content.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromContent from '../../state';
import * as contentActions from '../../state/content.actions';

@Component({
  selector: 'csbc-content-shell',
  templateUrl: './content-shell.component.html',
  styleUrls: ['./content-shell.component.scss']
})
export class ContentShellComponent implements OnInit {
  content!: Content;

  contentForm: UntypedFormGroup;
  title = 'Web Site Messages';

  constructor(
    private fb: UntypedFormBuilder,
    private _contentService: ContentService,
    private router: Router,
    private store: Store<fromContent.State>
  ) {
    this.contentForm = this.fb.group({
      title: [
        'Test',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      subTitle: '',
      body: '',
      location: '',
      dateAndTime: '',
      webContentTypeId: ''
    });
    router.navigate(['./admin/content/list']);
  }

  ngOnInit(): void {
    console.log('called content shell');
    this.store.dispatch(new contentActions.Load());
    this.store.select(fromContent.getContentList).subscribe(content => {
      this.store.dispatch(new contentActions.SetActiveContent());
    });
  }

  update(): void {
    this.contentForm.patchValue({
      title: this.content.title,
      subTitle: this.content.subTitle,
      body: this.content.body
    });
  }

  save() {}
  selectedContent() {
    console.log('call back to shell');
    this.router.navigate(['edit']);
  }
}
