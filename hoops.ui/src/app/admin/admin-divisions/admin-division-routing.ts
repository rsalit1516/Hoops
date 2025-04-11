import { NgModule } from '@angular/core';
import { ROUTER_CONFIGURATION, RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AdminDivisionShellComponent } from './admin-division-shell/admin-division-shell.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { DivisionListComponent } from './admin-division-list/divisionList.component';
import { DivisionDetailComponent } from './admin-division-detail/divisionDetail.component';

export const ADMIN_DIVISION_ROUTES: Routes = [
  {
    path: '',
    component: AdminDivisionShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: DivisionListComponent },
      { path: 'edit', component: DivisionDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];


export const AdminDivisionRoutingModule = RouterModule.forChild(ADMIN_DIVISION_ROUTES);
