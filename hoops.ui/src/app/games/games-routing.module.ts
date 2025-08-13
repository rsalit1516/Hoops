import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesShell } from './containers/games-shell/games-shell';
import { Schedule } from './components/schedule/schedule';
import { ScheduleCardView } from './components/schedule-card-view/schedule-card-view';
import { ScheduleShell } from './containers/schedule-shell/schedule-shell';
import { Scores } from './components/scores/scores';
import { StandingsShell } from './containers/standings-shell/standings-shell';
import { PageNotFound } from '@app/app.not-found';
import { PlayoffsShell } from './containers/playoffs-shell/playoffs-shell';

const gamesRoutes: Routes = [
  {
    path: '',
    component: GamesShell,
    children: [
      { path: '', component: ScheduleShell },
      { path: 'schedule', component: ScheduleShell },
      { path: 'standings', component: StandingsShell },
      { path: 'card', component: ScheduleCardView },
      { path: 'list', component: ScheduleShell },
      { path: 'scores', component: Scores },
      { path: 'playoffs', component: PlayoffsShell },
      { path: '**', component: PageNotFound },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gamesRoutes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
