import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesShellComponent } from './containers/games-shell/games-shell.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleCardViewComponent } from './components/schedule-card-view/schedule-card-view.component';
import { ScheduleShellComponent } from './containers/schedule-shell/schedule-shell.component';
import { ScoresComponent } from './components/scores/scores.component';
import { StandingsShellComponent } from './containers/standings-shell/standings-shell.component';
import { PageNotFoundComponent } from '@app/app.not-found.component';
import { PlayoffsShellComponent } from './containers/playoffs-shell/playoffs-shell.component';

const gamesRoutes: Routes = [
  {
    path: '',
    component: GamesShellComponent,
    children: [
      { path: '', component: ScheduleShellComponent },
      { path: 'schedule', component: ScheduleShellComponent },
      { path: 'standings', component: StandingsShellComponent },
      { path: 'card', component: ScheduleCardViewComponent },
      { path: 'list', component: ScheduleShellComponent },
      { path: 'scores', component: ScoresComponent },
      { path: 'playoffs', component: PlayoffsShellComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(gamesRoutes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {}
