import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WebContent } from '@app/domain/webContent';

@Component({
  selector: 'csbc-announcement',
  standalone: true,
  templateUrl: './announcement.component.html',
  styleUrls: [ '../../home.component.scss' ],
  imports: [CommonModule, MatCardModule]
})
export class AnnouncementComponent implements OnInit {
  @Input() info!: WebContent;
  constructor() {}

  ngOnInit(): void {}

  hideLocationAndDateTime() {

    return ((this.info.location === '' || this.info.location === null) && (this.info.dateAndTime === '' || this.info.dateAndTime === null) );
  }
}
