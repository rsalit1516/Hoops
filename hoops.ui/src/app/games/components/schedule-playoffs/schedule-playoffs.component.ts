import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import { Game } from '@domain/game';
import { MaterialModule } from '@app/core/material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { PlayoffGame } from '@domain/playoffGame';
import { DailyPlayoffScheduleComponent } from "../daily-playoff-schedule/daily-playoff-schedule.component";

@Component({
    selector: 'schedule-playoffs',
    standalone: true,
    templateUrl: './schedule-playoffs.component.html',
    styleUrls: ['./schedule-playoffs.component.scss'],
    imports: [CommonModule, DailyPlayoffScheduleComponent]
})
export class SchedulePlayoffsComponent {
  @Input() playoffGames!: Array<PlayoffGame[]>;
  public games: PlayoffGame[] | undefined;
  dataSource!: MatTableDataSource<PlayoffGame>;
  displayedColumns = [
    'gameDate',
    'gameTime',
    'Descr',
    'locationName',
    'homeTeam',
    'visitingTeam',
  ];

  gameDate!: '12/12/2023';
  gameTime!: '12:00 PM';
  descr!: 'Playoff A'

  constructor(private store: Store<fromGames.State>) {

    // this.store.select(fromGames.getPlayoffGames).subscribe((games) => {
    //  this.dataSource = new MatTableDataSource(this.playoffGames);
    // });
  }

  ngOnIt() {
    // this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      //  this.store.select(fromGames.getDivisionPlayoffGames).subscribe((games) => {
      //   this.playoffGames = games;
      //   console.log(this.playoffGames);
      //   this.dataSource = new MatTableDataSource(this.playoffGames);
        // this.gameService.groupByDate(games).subscribe((dailyGames) => {
        //   this.dailySchedule.push(dailyGames);
       //  });
    // });
    // this.gameDate = '12/12/2023';
    // this.gameTime = '12:00 PM';
    // this.descr =  'Playoff A'
    };
}


