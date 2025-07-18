import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminSeasonShell } from './admin-season-shell/admin-season-shell';
import { AdminSeasonDetail } from './admin-season-detail/admin-season-detail';
import { AdminSeasonList } from './admin-season-list/admin-season-list';
export const ADMIN_SEASONS_ROUTES: Routes = [
  {
    path: '',
    component: AdminSeasonShell,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: AdminSeasonList },
      { path: 'detail', component: AdminSeasonDetail },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];


export const AdminSeasonsRoutingModule = RouterModule.forChild(ADMIN_SEASONS_ROUTES);
