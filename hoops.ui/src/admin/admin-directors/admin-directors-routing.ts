import { AuthGuard } from '@app/auth/auth.guard';
import { Routes } from '@angular/router';
import { DirectorList } from './director-list/director-list';
import { DirectorDetail } from './director-detail/director-detail';

export const ADMIN_DIRECTORS_ROUTES: Routes = [
  {
    path: '',
    component: DirectorList,
    canActivate: [AuthGuard],
  },
  {
    path: 'new',
    component: DirectorDetail,
    canActivate: [AuthGuard],
    data: { mode: 'create' },
  },
  {
    path: ':id',
    component: DirectorDetail,
    canActivate: [AuthGuard],
    data: { mode: 'edit' },
  },
];
