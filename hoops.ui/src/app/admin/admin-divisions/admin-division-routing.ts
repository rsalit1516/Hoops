import { NgModule } from '@angular/core';
import { ROUTER_CONFIGURATION, RouterModule, Routes } from '@angular/router';

import { PageNotFound } from '@app/app.not-found';
import { AdminDivisionShell } from './admin-division-shell/admin-division-shell';
import { AuthGuard } from '@app/auth/auth.guard';
import { DivisionList } from './admin-division-list/divisionList';
import { DivisionDetail } from './admin-division-detail/divisionDetail';

export const ADMIN_DIVISION_ROUTES: Routes = [
  {
    path: '',
    component: AdminDivisionShell,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: DivisionList },
      { path: 'edit', component: DivisionDetail },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFound }
    ]
  }
];


export const AdminDivisionRoutingModule = RouterModule.forChild(ADMIN_DIVISION_ROUTES);
