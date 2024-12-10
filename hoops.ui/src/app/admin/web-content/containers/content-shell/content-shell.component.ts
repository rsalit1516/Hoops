import { Component, OnInit, Input, makeEnvironmentProviders, signal } from '@angular/core';
import { Content } from '@app/domain/content';
import { ContentService } from '../../content.service';
import { ActivatedRoute, Router, RouterLinkWithHref, RouterOutlet, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromContent from '../../../state';
import * as contentActions from '../../../state/admin.actions';
import { CommonModule } from '@angular/common';
import { ContentListComponent } from '../../components/content-list/contentList.component';
import { ContentEditComponent } from '../../components/content-edit/content-edit.component';
import { AdminGamesRoutingModule } from '@app/admin/admin-games/admin-games-routing.module';
import { CONTENT_ROUTES } from '../../content-routing';

@Component({
    selector: 'csbc-content-shell',
    template: `<section class="container-fluid">
    <h2>{{title}}</h2>
    <router-outlet></router-outlet>
  </section>`,
    styleUrls: ['./content-shell.component.scss'],
    imports: [
        CommonModule,
        ContentListComponent,
        ContentEditComponent,
        RouterOutlet,
        RouterLinkWithHref
    ]
})

export class ContentShellComponent implements OnInit {
  content!: Content;

  // contentForm: UntypedFormGroup;
  title = 'Web Site Notifications';
  content1 = signal(10);
  constructor(
    private router: Router,
    private store: Store<fromContent.State>,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const environmentProviders = makeEnvironmentProviders([
      { provide: CONTENT_ROUTES, useValue: CONTENT_ROUTES  },
    ]);
    this.store.select(fromContent.getContentList).subscribe((content) => {
      console.log(content);
      this.store
        .select(fromContent.getIsActiveOnly)
        .subscribe((isActiveContent) => {
          console.log(isActiveContent);
          isActiveContent
            ? this.store.dispatch(new contentActions.SetActiveContent())
            : this.store.dispatch(new contentActions.SetAllContent());
        })
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
