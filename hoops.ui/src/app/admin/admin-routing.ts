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
import { ADMIN_SEASONS_ROUTES } from './admin-seasons/admin-seasons-routing';
import { PendingChangesGuard } from './admin-games/pending-changes.guard';

export const ADMINROUTES: Routes = [
  {
    path: '',
    title: 'Admin Module',
    component: AdminShell,
    canActivate: [AuthGuard],

    children: [
      {
        path: 'dashboard',
        title: 'Admin Dashboard',
        component: AdminDashboard,
      },
      {
        path: 'seasons',
        title: 'Season Module',
        children: ADMIN_SEASONS_ROUTES,
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
      {
        path: 'users',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./admin-users/admin-users-list/admin-users-list').then(
                (m) => m.AdminUsersList
              ),
          },
          {
            path: 'detail',
            loadComponent: () =>
              import('./admin-users/admin-user-detail/admin-user-detail').then(
                (m) => m.AdminUserDetail
              ),
            canDeactivate: [PendingChangesGuard],
          },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', component: PageNotFound },
    ],
  },
];
export const AdminRouting = RouterModule.forChild(ADMINROUTES);
