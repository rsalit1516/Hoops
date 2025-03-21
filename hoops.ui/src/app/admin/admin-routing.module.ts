import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

// import { AuthGuard } from '../auth-guard.service';
import { AdminShellComponent } from './containers/admin-shell/admin-shell.component';
import { TeamListComponent } from './team/teamList.component';
import { AdminSeasonShellComponent } from './containers/admin-season-shell/admin-season-shell.component';
import { AdminDivisionShellComponent } from './containers/admin-division-shell/admin-division-shell.component';
import { PageNotFoundComponent } from '@app/app.not-found.component';

import { AuthGuard } from '../auth/auth.guard';
import { SeasonSetupComponent } from './containers/season-setup/season-setup.component';
import { ContentShellComponent } from './web-content/content-shell/content-shell.component';
import { DivisionDetailComponent } from './components/admin-division-detail/divisionDetail.component';
import { getWebContentDataResolver } from './get-web-content-data.resolver';
import { HouseholdShellComponent } from './admin-household/household-shell/household-shell.component';
import { HouseholdService } from '@app/services/household.service';

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
              import('./components/season-add/season-add.component')
                .then(
                  (mod) => mod.SeasonAddComponent),
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
        component: AdminDivisionShellComponent,
        title: 'Division Module',
        children: [
          {
              path: 'edit',
              loadComponent: () =>
                import('./components/admin-division-detail/divisionDetail.component').then(
                  (mod) => mod.DivisionDetailComponent
                ),
            },
            {
              path: 'list',
              loadComponent: () =>
                import('./components/admin-division-list/divisionList.component').then(
                  (mod) => mod.DivisionListComponent
                ),
            },
            {
              path: '',
              redirectTo: '/admin/division/list',
              pathMatch: 'full',
            },

            { path: '**', component: PageNotFoundComponent },
          ],

          },
      // { path: 'division-detail', component: DivisionDetailComponent },
      { path: 'season-setup', component: SeasonSetupComponent },
      {
        path: 'households',
        component: HouseholdShellComponent,
        // providers: [HouseholdService],
      },
      {
        path: 'people',
        loadComponent: () => import('./containers/admin-people-shell/admin-people-shell.component').then(
          (mod) => mod.AdminPeopleShellComponent
        ),
      },
      { path: 'teams', component: TeamListComponent },
      {
        path: 'games',
        loadChildren: () =>
          import('./admin-games/admin-games.module').then(
            (g) => g.AdminGamesModule
          ),
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
        children: [
          {
            path: 'edit',
            loadComponent: () =>
              import('./web-content/content-edit/content-edit.component').then(
                (mod) => mod.ContentEditComponent
              ),
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./web-content/content-list/contentList.component').then(
                (mod) => mod.ContentListComponent
              ),
          },
          {
            path: '',
            redirectTo: '/admin/content/list',
            pathMatch: 'full',
          },

          { path: '**', component: PageNotFoundComponent },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];
export const AdminRoutingModule = RouterModule.forChild(ADMINROUTES);
