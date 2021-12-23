import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'csbc-director-list',
  templateUrl: './director-list.component.html',
  styleUrls: ['./director-list.component.scss']
})
export class DirectorListComponent implements OnInit {
  _directors: any;
  get directors() {
    return this._directors;
  }
  @Input() set directors(directors: any[]) {
    this._directors = directors;
    this.datasource.data = directors;
  }
  datasource = new MatTableDataSource();
  displayedColumns = ['name'];
  constructor() { }

  ngOnInit() {

  }

}
