import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-csbc-card',
  templateUrl: './csbc-card.component.html',
  styleUrls: ['./csbc-card.component.scss']
})
export class CsbcCardComponent implements OnInit {
  @Input()
  title!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
