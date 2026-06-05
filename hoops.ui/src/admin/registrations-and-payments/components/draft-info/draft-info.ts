import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'draft-info',
    templateUrl: "./draft-info.html",
    styleUrls: ['./draft-info.css'],
    standalone: true
})
export class DraftInfo implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
