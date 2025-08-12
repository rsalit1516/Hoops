import { Component, OnInit, Input, input } from '@angular/core';
import { Standing } from '@domain/standing';
import { GameService } from '@app/services/game.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'csbc-standings',
  imports: [CommonModule, MatTableModule],
  templateUrl: "./standings.html",
  styleUrls: [
    '../../../shared/scss/tables.scss',
    './standings.scss',
    '../../containers/games-shell/games-shell.scss',
    '../../../../Content/styles.scss'
  ]
})
export class Standings implements OnInit {
  public title: string;
  readonly teams = input<any[]>();

  private _standings: Standing[] | undefined | null;
  get standings () {
    return this._standings as Standing[];
  }
  @Input()
  set standings (standings: Standing[]) {
    this._standings! = standings;
    this.dataSource = new MatTableDataSource(standings);
  }

  // need to add back Games behind
  // displayedColumns = ['teamName', 'won', 'lost', 'pct', 'streak'];
  displayedColumns = ['teamName', 'won', 'lost', 'pct', 'pf', 'pa'];
  dataSource: MatTableDataSource<Standing>;
  constructor () {
    this.title = 'Standings';
    this.dataSource = new MatTableDataSource(this.standings);
  }

  ngOnInit () {
    this.dataSource = new MatTableDataSource(this.standings);
  }
}
