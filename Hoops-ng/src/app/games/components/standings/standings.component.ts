import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Standing } from 'app/domain/standing';
import { GameService } from './../../game.service';

@Component({
  selector: 'csbc-standings',
  templateUrl: './standings.component.html',
  styleUrls: [
    './standings.component.scss',
    '../../containers/games-shell/games-shell.component.scss'
  ]
})
export class StandingsComponent implements OnInit {
  public title: string;
  @Input() teams: any[];

  private _standings: Standing[];
  get standings() {
    return this._standings;
  }
  @Input()
  set standings(standings: Standing[]) {
    this._standings = standings;
    console.log(standings);
    this.dataSource = new MatTableDataSource(standings);
  }

  displayedColumns = ['teamName', 'won', 'lost', 'pct', 'streak'];
  dataSource: MatTableDataSource<unknown>;
  constructor(private gameService: GameService) {
    this.title = 'Standings';
    this.dataSource = new MatTableDataSource(this.standings);
  }

  ngOnInit() {
    this.teams = this.getStandings();

    this.dataSource = new MatTableDataSource(this.standings);
    console.log(this.teams);
    console.log(this.standings);
  }

  getStandings() {
    // this.gameService.getStandingsByDivision()..subscribe(standings => {
    //   console.log(standings);
    //   this.standings = standings;
    // });
    // console.log(standings);
    return [
      {
        teamName: 'Blue(01)',
        wins: 2,
        losses: 1,
        pct: 66,
        gamesBehind: '1'
      },
      {
        teamName: 'Gray(02)',
        wins: 3,
        losses: 0,
        pct: 100,
        gamesBehind: '_'
      }
    ];
  }
}
