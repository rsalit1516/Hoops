import { Component, OnInit, Input } from '@angular/core';
import { Content } from '@app/domain/content';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ContentService } from '../../content.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromContent from '../../state';
import * as contentActions from '../../state/content.actions';
import { ContentListToolbarComponent } from '../../components/content-list-toolbar/content-list-toolbar.component';
import { ContentRoutingModule } from '../../content-routing.module';
import { ContentListComponent } from '../../components/content-list/contentList.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csbc-content-shell',
  standalone: true,
  templateUrl: './content-shell.component.html',
  styleUrls: [ './content-shell.component.scss' ],
  imports: [ CommonModule, ContentRoutingModule ]
})

export class ContentShellComponent implements OnInit {
  content!: Content;

  // contentForm: UntypedFormGroup;
  title = 'Web Site Messages';

  constructor(
    // private fb: UntypedFormBuilder,
    private _contentService: ContentService,
    private router: Router,
    private store: Store<fromContent.State>,
    private contentService: ContentService
  ) {
    // this.contentForm = this.fb.group({
    //   title: [
    //     'Test',
    //     [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    //   ],
    //   subTitle: '',
    //   body: '',
    //   location: '',
    //   dateAndTime: '',
    //   webContentTypeId: ''
    // });
    router.navigate(['./admin/content/list']);
  }

  ngOnInit(): void {
    console.log('called content shell');
    this.store.dispatch(new contentActions.Load());
    this.store.select(fromContent.getIsActiveOnly).subscribe(isActiveContent => {
      console.log(isActiveContent);
      isActiveContent ? this.store.dispatch(new contentActions.SetActiveContent()):
      this.store.dispatch(new contentActions.SetAllContent());
    });
    // this.contentService.saveContent(this.contentForm.value);

  }

  update(): void {
    // this.contentForm.patchValue({
    //   title: this.content.title,
    //   subTitle: this.content.subTitle,
    //   body: this.content.body
    // });
  }

  save() {}
  selectedContent() {
    console.log('call back to shell');
    this.router.navigate(['edit']);
  }
}
