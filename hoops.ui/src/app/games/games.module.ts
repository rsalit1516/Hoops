import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { StandingsComponent } from './components/standings/standings.component';
import { ScheduleCardViewComponent } from './components/schedule-card-view/schedule-card-view.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GamesRoutingModule } from './games-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/games.reducer';
import { GameEffects } from './state/game.effects';
import { GameFilterComponent } from './components/game-filter/game-filter.component';
import { GamesShellComponent } from './containers/games-shell/games-shell.component';
import { EffectsModule } from '@ngrx/effects';
import { GameService } from './game.service';
import { GameSortPipe } from './game-sort.pipe';
import { GamesTopMenuComponent } from './components/games-top-menu/games-top-menu.component';
import { ScheduleShellComponent } from './containers/schedule-shell/schedule-shell.component';
import { ScoresComponent } from './components/scores/scores.component';
import { StandingsShellComponent } from './containers/standings-shell/standings-shell.component';
import { GameScoreDialogComponent } from './components/game-score-dialog/game-score-dialog.component';
import { AppModule } from 'app/app.module';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    GamesRoutingModule,
    StoreModule.forFeature('games', reducer),
    EffectsModule.forFeature([GameEffects])
  ],
  exports: [GamesRoutingModule],
  declarations: [
    // GamesComponent,
    ScheduleComponent,
    StandingsComponent,
    ScheduleCardViewComponent,
    GameCardComponent,
    GameFilterComponent,
    GamesShellComponent,
    GameSortPipe,
    GamesTopMenuComponent,
    ScheduleShellComponent,
    ScoresComponent,
    StandingsShellComponent,
    GameScoreDialogComponent,
    DailyScheduleComponent
  ],
  entryComponents: [GameScoreDialogComponent],

  providers: [GameService]
})
export class GamesModule {}
