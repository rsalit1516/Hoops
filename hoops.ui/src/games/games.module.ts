import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScheduleCardView } from './components/schedule-card-view/schedule-card-view';
import { GameCard } from './components/game-card/game-card';
import { GamesRoutingModule } from './games-routing.module';
import { GameFilter } from './components/game-filter/game-filter';
import { GamesShell } from './containers/games-shell/games-shell';
import { GameSortPipe } from './game-sort.pipe';
import { GamesTopMenu } from './components/games-top-menu/games-top-menu';
import { ScheduleShell } from './containers/schedule-shell/schedule-shell';
import { Scores } from './components/scores/scores';
import { SchedulePlayoffs } from './components/schedule-playoffs/schedule-playoffs';
import { DailyPlayoffSchedule } from './components/daily-playoff-schedule/daily-playoff-schedule';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GamesRoutingModule,
    SchedulePlayoffs,
    DailyPlayoffSchedule,
    ScheduleCardView,
    GameCard,
    GameFilter,
    GamesShell,
    GameSortPipe,
    GamesTopMenu,
    ScheduleShell,
    Scores,
    MatNativeDateModule,
  ],
  exports: [GamesRoutingModule],
  providers: [],
})
export class GamesModule {}
