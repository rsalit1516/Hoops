import { RouterModule, Routes } from '@angular/router';

import { PageNotFound } from '@app/app.not-found';
import { AdminGamesShell } from './admin-games-shell/admin-games-shell';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminGamesList } from './admin-games-list/admin-games-list';
import { AdminGameDetail } from './admin-game-detail/admin-game-detail';
import { AdminGamesPlayoffsDetail } from './admin-games-playoffs-detail/admin-games-playoffs-detail';
import { AdminGamesPlayoffsList } from './admin-games-playoffs-list/admin-games-playoffs-list';

export const ADMINGAMESROUTES: Routes = [
  {
    path: '',
    component: AdminGamesShell,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: AdminGamesList },
      { path: 'list-playoff', component: AdminGamesPlayoffsList },
      { path: 'detail-regular', component: AdminGameDetail },
      { path: 'detail-playoff', component: AdminGamesPlayoffsDetail },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFound }
    ]
  }
];


export const AdminGamesRoutingModule = RouterModule.forChild(ADMINGAMESROUTES);
