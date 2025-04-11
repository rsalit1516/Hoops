import { NgModule } from '@angular/core';
import { ROUTER_CONFIGURATION, RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AdminGamesShellComponent } from './admin-games-shell/admin-games-shell.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminGamesListComponent } from './admin-games-list/admin-games-list.component';
import { AdminGameDetailComponent } from './admin-game-detail/admin-game-detail.component';
import { AdminGamesPlayoffsDetailComponent } from './admin-games-playoffs-detail/admin-games-playoffs-detail.component';
import { AdminGamesPlayoffsListComponent } from './admin-games-playoffs-list/admin-games-playoffs-list.component';

export const ADMINGAMESROUTES: Routes = [
  {
    path: '',
    component: AdminGamesShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: AdminGamesListComponent },
      { path: 'list-playoff', component: AdminGamesPlayoffsListComponent },
      { path: 'detail-regular', component: AdminGameDetailComponent },
      { path: 'detail-playoff', component: AdminGamesPlayoffsDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];


export const AdminGamesRoutingModule = RouterModule.forChild(ADMINGAMESROUTES);
