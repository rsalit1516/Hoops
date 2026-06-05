import { Component, inject, OnInit } from '@angular/core';
import { ContentService } from '@app/admin/web-content/content.service';
import { Meeting } from '../meeting/meeting';

@Component({
  selector: 'csbc-home-sidebar',
  templateUrl: "./home-sidebar.html",
  styleUrls: ['./home-sidebar.scss'],
  imports: [Meeting]
})
export class CsbcHomeSidebar implements OnInit {
  readonly #contentService = inject(ContentService);
  content = this.#contentService.activeWebContent;

  constructor() {}

  ngOnInit() {}
}
