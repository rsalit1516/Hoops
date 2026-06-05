import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'payments',
  templateUrl: './payments.html',
  styleUrls: ['./payments.css'],
  standalone: true,
})

/*
peopleId
SeasonId
Payment Type (Check, Credit Card, Online, Cash)
Amount
Balance'Check #
Date
Memo
*/
export class Payments implements OnInit {
  constructor() {}

  ngOnInit() {}
}
