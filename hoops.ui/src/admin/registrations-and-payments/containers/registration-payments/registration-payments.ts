import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'registration-payments',
  templateUrl: "./registration-payments.html",
  styleUrls: ['./registration-payments.css']
})
export class RegistrationPayments implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
