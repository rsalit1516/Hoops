import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayoffGame } from '@app/domain/playoffGame';
import { MatTableModule } from '@angular/material/table';


@Component({
    selector: 'csbc-daily-playoff-schedule',
    imports: [CommonModule, MatTableModule],
    templateUrl: './daily-playoff-schedule.component.html',
    styleUrls: [
        // '../../../shared/scss/tables.scss',
        './daily-playoff-schedule.component.scss',
        '../../../../Content/styles.scss'
    ]
})
export class DailyPlayoffScheduleComponent {
  setPlayoffGames (mockPlayoffGames: PlayoffGame[]) {
    throw new Error('Method not implemented.');
  }
  readonly playoffGames = input.required<PlayoffGame[]>();
  gameDate!: Date;
  displayedColumns = [
    'gameTime',
    'Descr',
    'locationName',
    'homeTeam',
    'visitingTeam',
  ];
  data: PlayoffGame[] = []; // = this.games;

  constructor() { }

  ngOnInit() {
    this.data = this.playoffGames();
    this.gameDate! = this.data[0].gameDate as Date;

  }
}
