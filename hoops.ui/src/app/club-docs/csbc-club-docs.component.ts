import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csbc-club-docs',
  templateUrl: './csbc-club-docs.component.html',
  styleUrls: ['./csbc-club-docs.component.scss']
})
export class CsbcClubDocsComponent implements OnInit {

  docDir = '../../assets/docs/';

  constructor() { }

  ngOnInit() {
  }

}
