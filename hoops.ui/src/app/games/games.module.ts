import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleCardViewComponent } from './components/schedule-card-view/schedule-card-view.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GamesRoutingModule } from './games-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/games.reducer';
import { GameEffects } from './state/game.effects';
import { GameFilterComponent } from './components/game-filter/game-filter.component';
import { GamesShellComponent } from './containers/games-shell/games-shell.component';
import { EffectsModule } from '@ngrx/effects';
import { GameService } from '@app/services/game.service';
import { GameSortPipe } from './game-sort.pipe';
import { GamesTopMenuComponent } from './components/games-top-menu/games-top-menu.component';
import { ScheduleShellComponent } from './containers/schedule-shell/schedule-shell.component';
import { ScoresComponent } from './components/scores/scores.component';
import { GameScoreDialogComponent } from './components/game-score-dialog/game-score-dialog.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { SchedulePlayoffsComponent } from './components/schedule-playoffs/schedule-playoffs.component';
import { DailyPlayoffScheduleComponent } from './components/daily-playoff-schedule/daily-playoff-schedule.component';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GamesRoutingModule,
    SchedulePlayoffsComponent,
    DailyPlayoffScheduleComponent,
    StoreModule.forFeature('games', reducer),
    EffectsModule.forFeature([GameEffects]),
    // GamesComponent,
    ScheduleComponent,
    ScheduleCardViewComponent,
    GameCardComponent,
    GameFilterComponent,
    GamesShellComponent,
    GameSortPipe,
    GamesTopMenuComponent,
    ScheduleShellComponent,
    ScoresComponent,
    GameScoreDialogComponent,
    DailyScheduleComponent,
    MatNativeDateModule
],
    exports: [GamesRoutingModule],
    providers: [GameService],
})
export class GamesModule {}
