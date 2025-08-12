import { RouterModule, Routes } from '@angular/router';

import { PageNotFound } from '@app/app.not-found';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminPeopleShell } from './admin-people-shell/admin-people-shell';
import { PeopleSearchResults } from './people-search-results/people-search-results';
import { AdminPeopleDetail } from './admin-people-detail/admin-people-detail';
import { PeopleList } from './people-list/people-list';

export const ADMIN_PEOPLE_ROUTES: Routes = [
  {
    path: '',
    component: AdminPeopleShell,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: PeopleList },
      { path: 'detail', component: AdminPeopleDetail },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFound }
    ]
  }
];


export const AdminPeopleRoutingModule = RouterModule.forChild(ADMIN_PEOPLE_ROUTES);
