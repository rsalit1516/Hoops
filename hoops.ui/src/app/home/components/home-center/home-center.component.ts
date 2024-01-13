import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'csbc-home-center',
    template: `<div class="tag">
  <h4 id="BestGame" class="tag-line">
    CSBC Where the Best Game is Played!!!
  </h4>
</div>`,
    styleUrls: ['../../home.component.scss'],
    standalone: true
})
export class HomeCenterComponent implements OnInit {
  coverImage: string;
  constructor () {
    this.coverImage = '../../../assets/images/sky.jpg';
  }

  ngOnInit () {
  }

}
