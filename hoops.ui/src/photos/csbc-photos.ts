import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-csbc-photos',
    templateUrl: "./csbc-photos.html",
    styleUrls: ['./csbc-photos.css'],
    standalone: true
})
export class CsbcPhotos implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
