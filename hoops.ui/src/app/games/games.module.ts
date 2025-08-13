import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Schedule } from './components/schedule/schedule';
import { ScheduleCardView } from './components/schedule-card-view/schedule-card-view';
import { GameCard } from './components/game-card/game-card';
import { GamesRoutingModule } from './games-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/games.reducer';
import { GameEffects } from './state/game.effects';
import { GameFilter } from './components/game-filter/game-filter';
import { GamesShell } from './containers/games-shell/games-shell';
import { EffectsModule } from '@ngrx/effects';
import { GameService } from '@app/services/game.service';
import { GameSortPipe } from './game-sort.pipe';
import { GamesTopMenu } from './components/games-top-menu/games-top-menu';
import { ScheduleShell } from './containers/schedule-shell/schedule-shell';
import { Scores } from './components/scores/scores';
// import { GameScoreDialog } from './components/game-score-dialog/game-score-dialog';
// import { DailySchedule } from './components/daily-schedule/daily-schedule';
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
    StoreModule.forFeature('games', reducer),
    EffectsModule.forFeature([GameEffects]),
    // GamesComponent,
    // Schedule,
    ScheduleCardView,
    GameCard,
    GameFilter,
    GamesShell,
    GameSortPipe,
    GamesTopMenu,
    ScheduleShell,
    Scores,
    // GameScoreDialog,
    // DailySchedule,
    MatNativeDateModule,
  ],
  exports: [GamesRoutingModule],
  // GameService is providedIn: 'root' already; avoid shadowing with a feature-level provider
  providers: [],
})
export class GamesModule {}
