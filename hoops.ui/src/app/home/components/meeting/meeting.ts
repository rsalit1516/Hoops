import { Component, OnInit, input } from '@angular/core';
import { WebContent } from '../../../domain/webContent';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'csbc-meeting',
    templateUrl: "./meeting.html",
    styleUrls: ['./meeting.scss'],
    imports: [MatCardModule]
})
export class Meeting implements OnInit {
readonly info = input<WebContent>();
  constructor() { }

  ngOnInit(): void {
  }

}
