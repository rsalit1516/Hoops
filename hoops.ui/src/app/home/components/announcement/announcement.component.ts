import { Component, OnInit, Input } from '@angular/core';
import { WebContent } from '@app/domain/webContent';
import { Content } from 'app/domain/content';

@Component({
  selector: 'csbc-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['../../home.component.scss'],
})
export class AnnouncementComponent implements OnInit {
  @Input() info!: WebContent;
  constructor() {}

  ngOnInit(): void {}

  hideLocationAndDateTime() {

    return ((this.info.location === '' || this.info.location === null) && (this.info.dateAndTime === '' || this.info.dateAndTime === null) );
  }
}
