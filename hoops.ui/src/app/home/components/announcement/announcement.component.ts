import { Component, OnInit, Input } from '@angular/core';
import { Content } from 'app/domain/content';

@Component({
  selector: 'csbc-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['../../home.component.scss'],
})
export class AnnouncementComponent implements OnInit {
  @Input() info!: Content;
  constructor() {}

  ngOnInit(): void {}

  hideLocationAndDateTime() {
    return (this.info.location=== null && this.info.dateAndTime === null );
  }
}
