import { Component, OnInit, Input } from '@angular/core';
import { Content } from 'app/domain/content';
import { WebContent } from '../../../domain/webContent';

@Component({
  selector: 'csbc-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
@Input() info: WebContent;
  constructor() { }

  ngOnInit(): void {
  }

}
