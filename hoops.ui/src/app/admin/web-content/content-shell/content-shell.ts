import { Component, OnInit, makeEnvironmentProviders, inject } from '@angular/core';
import { Content } from '@app/domain/content';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ContentList } from '../content-list/contentList';
import { ContentEdit } from '../content-edit/content-edit';
import { CONTENT_ROUTES } from '../content-routing';
import { ContentService } from '../content.service';

@Component({
    selector: 'csbc-content-shell',
    template: `<section class="container-fluid">
    <h2>{{title}}</h2>
    <router-outlet></router-outlet>
  </section>`,
    styleUrls: ['./content-shell.scss'],
    imports: [
        CommonModule,
        ContentList,
        ContentEdit,
        RouterOutlet,
        RouterLinkWithHref
    ]
})

export class ContentShell implements OnInit {
  router = inject(Router);
  #contentService = inject(ContentService);
  content!: Content;

  title = 'Web Site Notifications';

  ngOnInit(): void {
    const environmentProviders = makeEnvironmentProviders([
      { provide: CONTENT_ROUTES, useValue: CONTENT_ROUTES  },
    ]);
    this.#contentService.fetchAllContents();
  }

  selectedContent() {
    console.log('call back to shell');
    this.router.navigate(['edit']);
  }
}
