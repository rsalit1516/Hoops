import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'csbc-director-edit',
    templateUrl: "./director-edit.html",
    styleUrls: ['./director-edit.css'],
    standalone: true
})
export class DirectorEdit implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
