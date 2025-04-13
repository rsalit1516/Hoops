import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { HouseholdShellComponent } from './household-shell/household-shell.component';
import { HouseholdListComponent } from './household-list/household-list.component';
import { HouseholdDetailComponent } from './household-detail/household-detail.component';

export const ADMIN_HOUSEHOLD_ROUTES: Routes = [
  {
    path: '',
    component: HouseholdShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: HouseholdListComponent },
      { path: 'detail', component: HouseholdDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];


export const HouseholdRoutingModule = RouterModule.forChild(ADMIN_HOUSEHOLD_ROUTES);
