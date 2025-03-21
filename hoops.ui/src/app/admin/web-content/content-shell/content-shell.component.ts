import { Component, OnInit, Input, makeEnvironmentProviders, signal, inject } from '@angular/core';
import { Content } from '@app/domain/content';
import { ContentService } from '../content.service';
import { ActivatedRoute, Router, RouterLinkWithHref, RouterOutlet, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromContent from '../../state';
import * as contentActions from '../../state/admin.actions';
import { CommonModule } from '@angular/common';
import { ContentListComponent } from '../content-list/contentList.component';
import { ContentEditComponent } from '../content-edit/content-edit.component';
import { AdminGamesRoutingModule } from '@app/admin/admin-games/admin-games-routing.module';
import { CONTENT_ROUTES } from '../content-routing';

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
  router = inject(Router);
  content!: Content;

  title = 'Web Site Notifications';

  ngOnInit(): void {
    const environmentProviders = makeEnvironmentProviders([
      { provide: CONTENT_ROUTES, useValue: CONTENT_ROUTES  },
    ]);
  }

  selectedContent() {
    console.log('call back to shell');
    this.router.navigate(['edit']);
  }
}
