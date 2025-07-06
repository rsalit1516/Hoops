import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminPeopleShellComponent } from './admin-people-shell/admin-people-shell';
import { PeopleSearchResults } from './people-search-results/people-search-results';
import { AdminPeopleDetailComponent } from './admin-people-detail/admin-people-detail.component';
import { PeopleList } from './people-list/people-list';

export const ADMIN_PEOPLE_ROUTES: Routes = [
  {
    path: '',
    component: AdminPeopleShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: PeopleList },
      { path: 'detail', component: AdminPeopleDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];


export const AdminPeopleRoutingModule = RouterModule.forChild(ADMIN_PEOPLE_ROUTES);
