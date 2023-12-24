import { Component, OnInit, Input } from '@angular/core';
import { Standing } from '@domain/standing';
import { GameService } from './../../game.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'csbc-standings',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './standings.component.html',
  styleUrls: [
    './standings.component.scss',
    '../../containers/games-shell/games-shell.component.scss',
    '../../../../Content/styles.scss'

  ]
})
export class StandingsComponent implements OnInit {
  public title: string;
  @Input() teams!: any[];

  private _standings: Standing[] | undefined | null;
  get standings() {
    return this._standings as Standing[];
  }
  @Input()
  set standings(standings: Standing[]) {
    this._standings! = standings;
    console.log(standings);
    this.dataSource = new MatTableDataSource(standings);
  }

  // need to add back Games behind
  // displayedColumns = ['teamName', 'won', 'lost', 'pct', 'streak'];
  displayedColumns = ['teamName', 'won', 'lost', 'pct', 'pf', 'pa'];
  dataSource: MatTableDataSource<Standing>;
  constructor(private gameService: GameService) {
    this.title = 'Standings';
    this.dataSource = new MatTableDataSource(this.standings);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.standings);
    console.log(this.teams);
    console.log(this.standings);
  }
}
