import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Content } from '../../../domain/content';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ContentService } from '../content.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'content-list-toolbar',
    templateUrl: "./content-list-toolbar.html",
    styleUrls: ['./content-list-toolbar.scss',
        '../../admin.scss'],
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule
]
})
export class ContentListToolbar implements OnInit {
  private router = inject(Router);
  private logger = inject(LoggerService);

  readonly #contentService = inject(ContentService);
  checked = true;
  isActive = signal<boolean>(true);
  activeLabel = 'Active Only';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {

  }

  ngOnInit() {
    // this.isActiveContent$.subscribe(isActiveContent => {
    //   console.log(isActiveContent);
    //   this.store.dispatch(new contentActions.SetActiveContent());
    // });
  }

  addContent() {
    const content = new Content();
    this.#contentService.selectedContent.set(content as any);
    this.router.navigate(['./admin/content/edit']);
  }
  filterContent(checked: boolean) {
    // const isActive = this.filterForm.value.activeContent === true;
    this.isActive.set(checked);
    this.logger.debug('Filter content active only:', checked);
    this.#contentService.isActiveContent.set(checked);
    // this.store.dispatch(new contentActions.SetIsActiveOnly(checked));
  }
}
