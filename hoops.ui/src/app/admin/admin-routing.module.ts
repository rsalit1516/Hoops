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
import { ContentShellComponent } from './web-content/containers/content-shell/content-shell.component';
import { DivisionDetailComponent } from './components/admin-division-detail/divisionDetail.component';


const adminRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [ AuthGuard ],

    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'seasons', component: AdminSeasonShellComponent },
      { path: 'division', component: AdminDivisionShellComponent },
      { path: 'division-detail', component: DivisionDetailComponent},
      { path: 'season-setup', component: SeasonSetupComponent },
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
      // {
      //   path: 'registrations',
      //   loadChildren: () =>
      //     import(
      //       './registrations-and-payments/registrations-and-payments.module'
      //     ).then((m) => m.RegistrationsAndPaymentsModule),
      // },
      {
        path: 'content',
        component: ContentShellComponent,
      children: [
        {
          path: 'edit',
          // component: ContentEditComponent,
          loadComponent: () =>
            import('./web-content/components/content-edit/content-edit.component').then(
              (mod) => mod.ContentEditComponent
            ),
        },
        {
          path: 'list',
          // component: ContentListComponent,
          loadComponent: () =>
            import('./web-content/components/content-list/contentList.component').then(
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

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
