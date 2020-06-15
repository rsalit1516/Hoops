import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'csbc-home-center',
  template: `<div class="col-sm-8 offset-sm-3 col-xs-12 tag">
  <h4 id="BestGame" class="tag-line">
    <em>CSBC Where the Best Game is Played!!!</em>
  </h4>
</div>`
,
  styleUrls: ['../../home.component.scss']
})
export class HomeCenterComponent implements OnInit {
  coverImage: string;
  constructor () {
    this.coverImage = '../../../assets/images/sky.jpg';
  }

  ngOnInit () {
  }

}