import { CommonModule } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WebContent } from '@app/domain/webContent';

@Component({
    selector: 'csbc-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./../../../../Content/styles.scss',
        '../../home.component.scss'],
    imports: [CommonModule, MatCardModule]
})
export class AnnouncementComponent implements OnInit {
  readonly info = input.required<WebContent>();
  constructor() {}

  ngOnInit(): void {}

  hideLocationAndDateTime() {

    const info = this.info();
    return ((info.location === '' || info.location === null) && (info.dateAndTime === '' || info.dateAndTime === null) );
  }
}
