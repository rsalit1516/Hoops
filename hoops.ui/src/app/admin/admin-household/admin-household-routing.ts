import { RouterModule, Routes } from '@angular/router';

import { PageNotFound } from '@app/app.not-found';
import { AuthGuard } from '@app/auth/auth.guard';
import { HouseholdShell } from './household-shell/household-shell';
import { HouseholdList } from './household-list/household-list';
import { HouseholdDetail } from './household-detail/household-detail';

export const ADMIN_HOUSEHOLD_ROUTES: Routes = [
  {
    path: '',
    component: HouseholdShell,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: HouseholdList },
      { path: 'detail', component: HouseholdDetail },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFound }
    ]
  }
];


export const HouseholdRoutingModule = RouterModule.forChild(ADMIN_HOUSEHOLD_ROUTES);
