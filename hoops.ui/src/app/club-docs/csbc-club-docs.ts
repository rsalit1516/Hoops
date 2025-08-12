import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'csbc-club-docs',
  templateUrl: "./csbc-club-docs.html",
  styleUrls: ['./club-docs.scss',
    '../shared/scss/cards.scss',
    '../shared/scss/tables.scss',
  ],
  imports: [MatCardModule]
})
export class CsbcClubDocs implements OnInit {

  docDir = '../../assets/docs/';

  constructor () { }

  ngOnInit () {
  }

}
