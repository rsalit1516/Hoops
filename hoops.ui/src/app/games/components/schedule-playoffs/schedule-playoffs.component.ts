import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import { Game } from '@app/domain/game';
import { MaterialModule } from '@app/core/material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { PlayoffGame } from '@app/domain/playoffGame';

@Component({
  selector: 'schedule-playoffs',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './schedule-playoffs.component.html',
  styleUrls: ['./schedule-playoffs.component.scss', './../../containers/games-shell/games-shell.component.scss']
})
export class SchedulePlayoffsComponent {
  @Input() playoffGames!: PlayoffGame[];
  public games: Game[] | undefined;
  dataSource!: MatTableDataSource<PlayoffGame>;
  displayedColumns!: string[];

  gameDate!: '12/12/2023';
  gameTime!: '12:00 PM';
  descr!: 'Playoff A'

  constructor(private store: Store<fromGames.State>) {
    this.displayedColumns = [
      'gameDate',
      'gameTime',
      'Descr',
      'locationName',
      'homeTeam',
      'visitingTeam',
      // 'homeTeamScore',
      // 'visitingTeamScore',
    ];
    // this.store.select(fromGames.getPlayoffGames).subscribe((games) => {
      this.dataSource = new MatTableDataSource(this.playoffGames);
    // });
  }

  ngOnIt() {
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      // this.store.select(fromGames.getDivisionPlayoffGames).subscribe((games) => {
      //   this.games = games;

      //   // this.gameService.groupByDate(games).subscribe((dailyGames) => {
      //   //   this.dailySchedule.push(dailyGames);
      //   });
    });
    this.gameDate = '12/12/2023';
    this.gameTime = '12:00 PM';
    this.descr =  'Playoff A'
    };
}


