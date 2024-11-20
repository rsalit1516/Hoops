import { Component, OnInit, Input } from '@angular/core';
import { WebContent } from '../../../domain/webContent';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'csbc-meeting',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.scss'],
    imports: [MatCardModule]
})
export class MeetingComponent implements OnInit {
@Input() info: WebContent | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
