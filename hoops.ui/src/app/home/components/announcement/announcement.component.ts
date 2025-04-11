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
  imports: [CommonModule, MatCardModule]
})
export class AnnouncementComponent implements OnInit {
  readonly info = input.required<WebContent>();
  bodyText = '';
  constructor () {
    // console.log(this.info());
  }

  ngOnInit (): void {
    console.log(this.info());
    this.formattedText();
  }

  hideLocationAndDateTime () {

    const info = this.info();
    return ((info.location === '' || info.location === null) && (info.dateAndTime === '' || info.dateAndTime === null));
  }
  formattedText (): string {
    const info = this.info();
    const text = info && info.body ? info.body.replace(/\n/g, '<br>') : '';
    this.bodyText = text;
    return text;
  }
}
