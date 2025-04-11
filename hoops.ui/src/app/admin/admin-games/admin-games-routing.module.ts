import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AdminGamesShellComponent } from './admin-games-shell/admin-games-shell.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminGamesListComponent } from './admin-games-list/admin-games-list.component';
import { AdminGameDetailComponent } from './admin-game-detail/admin-game-detail.component';
import { AdminGamesPlayoffsDetailComponent } from './admin-games-playoffs-detail/admin-games-playoffs-detail.component';
import { AdminGamesPlayoffsListComponent } from './admin-games-playoffs-list/admin-games-playoffs-list.component';

const adminGamesRoutes: Routes = [
  {
    path: '',
    component: AdminGamesShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: '', component: AdminGamesListComponent },
      { path: 'list', component: AdminGamesListComponent },
      { path: 'list-playoff', component: AdminGamesPlayoffsListComponent },
      { path: 'detail-regular', component: AdminGameDetailComponent },
      { path: 'detail-playoff', component: AdminGamesPlayoffsDetailComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminGamesRoutes)],
  exports: [RouterModule]
})
export class AdminGamesRoutingModule { }
