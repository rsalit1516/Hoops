import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-csbc-card',
    templateUrl: "./csbc-card.html",
    styleUrls: ['./csbc-card.scss'],
    standalone: true
})
export class CsbcCard implements OnInit {
  @Input()
  title!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
