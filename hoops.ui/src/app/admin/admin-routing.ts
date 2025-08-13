import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './dashboard/admin-dashboard';

import { AdminShell } from './containers/admin-shell/admin-shell';
import { TeamList } from './team/teamList';
import { AdminSeasonShell } from './admin-seasons/admin-season-shell/admin-season-shell';
import { PageNotFound } from '@app/app.not-found';
import { AuthGuard } from '../auth/auth.guard';
import { SeasonSetup } from './containers/season-setup/season-setup';
import { ContentShell } from './web-content/content-shell/content-shell';
import { getWebContentDataResolver } from './get-web-content-data.resolver';
import { HouseholdShell } from './admin-household/household-shell/household-shell';
import { ADMINGAMESROUTES } from './admin-games/admin-games-routing';
import { CONTENT_ROUTES } from './web-content/content-routing';
import { ADMIN_DIVISION_ROUTES } from './admin-divisions/admin-division-routing';
import { ADMIN_HOUSEHOLD_ROUTES } from './admin-household/admin-household-routing';
import { ADMIN_PEOPLE_ROUTES } from './admin-people/admin-people-routing';

export const ADMINROUTES: Routes = [
  {
    path: '',
    title: 'Admin Module',
  component: AdminShell,
    canActivate: [AuthGuard],

    children: [
  { path: 'dashboard', title: 'Admin Dashboard', component: AdminDashboard },
      {
        path: 'seasons', component: AdminSeasonShell,
        title: 'Seasons Module',
        children: [
          {
            path: 'edit',
            loadComponent: () =>
              import('./components/season-add-edit/season-add-edit')
                .then(
                  (mod) => mod.SeasonAddEdit),
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./admin-seasons/admin-season-list/admin-season-list').then(
                (mod) => mod.AdminSeasonList
              ),
          },
          {
            path: '',
            loadComponent: () =>
              import('./admin-seasons/admin-season-list/admin-season-list').then(
                (mod) => mod.AdminSeasonList
              ),
            pathMatch: 'full',
          },

          { path: '**', component: PageNotFound },
        ],
      },
      {
        path: 'division',
        title: 'Division Module',
        children: ADMIN_DIVISION_ROUTES,
      },
  { path: 'season-setup', component: SeasonSetup },
      {
        path: 'households',
        children: ADMIN_HOUSEHOLD_ROUTES,
      },
      {
        path: 'people',
        children: ADMIN_PEOPLE_ROUTES,
      },
  { path: 'teams', component: TeamList },
      {
        path: 'games',
        children: ADMINGAMESROUTES,
        // loadComponent: () =>
        //   import('./admin-games/admin-games-shell/admin-games-shell').then(
        //     (g) => g.AdminGamesShell
        //   ),
      },
      {
        path: 'director',
        loadChildren: () =>
          import('./director/director.module').then((m) => m.DirectorModule),
      },

      {
        path: 'content',
  component: ContentShell,
        resolve: { data: getWebContentDataResolver },
        children: CONTENT_ROUTES,
      },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFound },
    ]
  }
];
export const AdminRouting = RouterModule.forChild(ADMINROUTES);
