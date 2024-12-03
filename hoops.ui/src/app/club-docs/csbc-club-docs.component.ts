import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-csbc-club-docs',
    templateUrl: './csbc-club-docs.component.html',
    styleUrls: ['./club-docs.component.scss'],
    imports: [MatCardModule]
})
export class CsbcClubDocsComponent implements OnInit {

  docDir = '../../assets/docs/';

  constructor() { }

  ngOnInit() {
  }

}
