import { CommonModule } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WebContent } from '@app/domain/webContent';

@Component({
  selector: 'csbc-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: [
    '../../home.component.scss',
    '../../../shared/scss/cards.scss',
     ],
  imports: [ CommonModule, MatCardModule ]
})
export class AnnouncementComponent implements OnInit {
  readonly info = input.required<WebContent>();
  bodyText = '';
  constructor() { }

  ngOnInit(): void {
    this.formattedText();
  }

  hideLocationAndDateTime() {

    const info = this.info();
    return ((info.location === '' || info.location === null) && (info.dateAndTime === '' || info.dateAndTime === null));
  }
  formattedText(): string {
    const info = this.info();
    console.log(info.body);
    const text = info && info.body ? info.body.replace(/\n/g, '<br>') : '';
    console.log(text);
    this.bodyText = text;
    return text;
  }
}
