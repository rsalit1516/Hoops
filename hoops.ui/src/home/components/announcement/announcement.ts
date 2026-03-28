
import { Component, OnInit, input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WebContent } from '@app/domain/webContent';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-announcement',
  templateUrl: "./announcement.html",
  styleUrls: [
    '../../home.scss',
    '../../../shared/scss/cards.scss',
  ],
  imports: [MatCardModule]
})
export class Announcement implements OnInit {
  readonly info = input.required<WebContent>();
  private logger = inject(LoggerService);
  bodyText = '';
  constructor () {
  }

  ngOnInit (): void {
    this.logger.debug('Announcement info:', this.info());
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
