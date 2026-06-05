import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-page-not-found-standalone',
  template: '<h2>Page not found</h2>',
  standalone: true
})
export class PageNotFoundStandAlone {}
