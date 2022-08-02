import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from 'app/app.not-found.component';
import { AdminGamesShellComponent } from './containers/admin-games-shell/admin-games-shell.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { AdminGamesListComponent } from '../admin-shared/admin-games-list/admin-games-list.component';
import { AdminGameDetailComponent } from '../admin-shared/admin-game-detail/admin-game-detail.component';

const adminGamesRoutes: Routes = [
  {
    path: '',
    component: AdminGamesShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: '', component: AdminGamesListComponent },
      { path: 'list', component: AdminGamesListComponent },
      { path: 'detail', component: AdminGameDetailComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminGamesRoutes)],
  exports: [RouterModule]
})
export class AdminGamesRoutingModule {}
