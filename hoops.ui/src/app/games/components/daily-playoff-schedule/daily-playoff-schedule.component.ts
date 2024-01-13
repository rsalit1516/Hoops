import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayoffGame } from '@app/domain/playoffGame';
import { MatTab } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'csbc-daily-playoff-schedule',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './daily-playoff-schedule.component.html',
  styleUrls: ['./daily-playoff-schedule.component.scss']
})
export class DailyPlayoffScheduleComponent {
  @Input() playoffGames!: PlayoffGame[];
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
    this.data = this.playoffGames;
    this.gameDate! = this.data[0].gameDate as Date;

  }
}
