import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

import { AdminShellComponent } from './containers/admin-shell/admin-shell.component';
import { TeamListComponent } from './team/teamList.component';
import { AdminSeasonShellComponent } from './containers/admin-season-shell/admin-season-shell.component';
import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AuthGuard } from '../auth/auth.guard';
import { SeasonSetupComponent } from './containers/season-setup/season-setup.component';
import { ContentShellComponent } from './web-content/content-shell/content-shell.component';
import { getWebContentDataResolver } from './get-web-content-data.resolver';
import { HouseholdShellComponent } from './admin-household/household-shell/household-shell.component';
import { ADMINGAMESROUTES } from './admin-games/admin-games-routing';
import { CONTENT_ROUTES } from './web-content/content-routing';
import { ADMIN_DIVISION_ROUTES } from './admin-divisions/admin-division-routing';
import { ADMIN_HOUSEHOLD_ROUTES } from './admin-household/admin-household-routing';
import { ADMIN_PEOPLE_ROUTES } from './admin-people/admin-people-routing';

export const ADMINROUTES: Routes = [
  {
    path: '',
    title: 'Admin Module',
    component: AdminShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'dashboard', title: 'Admin Dashboard', component: AdminDashboardComponent },
      {
        path: 'seasons', component: AdminSeasonShellComponent,
        title: 'Seasons Module',
        children: [
          {
            path: 'edit',
            loadComponent: () =>
              import('./components/season-add-edit/season-add-edit.component')
                .then(
                  (mod) => mod.SeasonAddEditComponent),
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./components/admin-season-list/admin-season-list.component').then(
                (mod) => mod.AdminSeasonListComponent
              ),
          },
          {
            path: '',
            loadComponent: () =>
              import('./components/admin-season-list/admin-season-list.component').then(
                (mod) => mod.AdminSeasonListComponent
              ),
            pathMatch: 'full',
          },

          { path: '**', component: PageNotFoundComponent },
        ],
      },
      {
        path: 'division',
        title: 'Division Module',
        children: ADMIN_DIVISION_ROUTES,
      },
      { path: 'season-setup', component: SeasonSetupComponent },
      {
        path: 'households',
        children: ADMIN_HOUSEHOLD_ROUTES,
      },
      {
        path: 'people',
        children: ADMIN_PEOPLE_ROUTES,
      },
      { path: 'teams', component: TeamListComponent },
      {
        path: 'games',
        children: ADMINGAMESROUTES,
        // loadComponent: () =>
        //   import('./admin-games/admin-games-shell/admin-games-shell.component').then(
        //     (g) => g.AdminGamesShellComponent
        //   ),
      },
      {
        path: 'director',
        loadChildren: () =>
          import('./director/director.module').then((m) => m.DirectorModule),
      },

      {
        path: 'content',
        component: ContentShellComponent,
        resolve: { data: getWebContentDataResolver },
        children: CONTENT_ROUTES,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];
export const AdminRouting = RouterModule.forChild(ADMINROUTES);
