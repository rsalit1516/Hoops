import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'csbc-user',
    templateUrl: "./user.html",
    styleUrls: ['./user.css'],
    standalone: true
})
export class User implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
