import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@app/app.not-found.component';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminPeopleShellComponent } from './admin-people-shell/admin-people-shell.component';
import { PeopleSearchComponent } from './people-search/people-search.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PeopleSearchResultsComponent } from './people-search-results/people-search-results.component';

export const ADMIN_PEOPLE_ROUTES: Routes = [
  {
    path: '',
    component: AdminPeopleShellComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'list', component: PeopleSearchResultsComponent },
      { path: 'detail', component: PersonalInfoComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];


export const AdminPeopleRoutingModule = RouterModule.forChild(ADMIN_PEOPLE_ROUTES);
