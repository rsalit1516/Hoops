import { Routes } from '@angular/router';

// Export routes for standalone lazy-loading
export const GAMES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/games-shell/games-shell').then((m) => m.GamesShell),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./containers/schedule-shell/schedule-shell').then(
            (m) => m.ScheduleShell
          ),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./containers/schedule-shell/schedule-shell').then(
            (m) => m.ScheduleShell
          ),
      },
      {
        path: 'standings',
        loadComponent: () =>
          import('./containers/standings-shell/standings-shell').then(
            (m) => m.StandingsShell
          ),
      },
      {
        path: 'card',
        loadComponent: () =>
          import('./components/schedule-card-view/schedule-card-view').then(
            (m) => m.ScheduleCardView
          ),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./containers/schedule-shell/schedule-shell').then(
            (m) => m.ScheduleShell
          ),
      },
      {
        path: 'scores',
        loadComponent: () =>
          import('./components/scores/scores').then((m) => m.Scores),
      },
      {
        path: 'playoffs',
        loadComponent: () =>
          import('./containers/playoffs-shell/playoffs-shell').then(
            (m) => m.PlayoffsShell
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('@app/app.not-found').then((m) => m.PageNotFound),
      },
    ],
  },
];
//       { path: 'card', component: ScheduleCardView },
//       { path: 'list', component: ScheduleShell },
//       { path: 'scores', component: Scores },
//       { path: 'playoffs', component: PlayoffsShell },
//       { path: '**', component: PageNotFound },
//     ],
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(gamesRoutes)],
//   exports: [RouterModule],
// })
export class GamesRoutingModule {}
