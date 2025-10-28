import { AuthGuard } from '@app/auth/auth.guard';
import { DirectorList } from '../director/component/director-list/director-list';
import { AdminDirectorDetail } from './admin-director-detail';
import { Routes } from '@angular/router';

export const ADMIN_DIRECTORS_ROUTES: Routes = [
  {
    path: '',
    component: DirectorList,
    canActivate: [AuthGuard],
  },
  {
    path: 'new',
    component: AdminDirectorDetail,
    canActivate: [AuthGuard],
    data: { mode: 'create' },
  },
  {
    path: ':id',
    component: AdminDirectorDetail,
    canActivate: [AuthGuard],
    data: { mode: 'edit' },
  },
];
