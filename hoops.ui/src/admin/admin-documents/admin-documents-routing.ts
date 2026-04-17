import { Routes } from '@angular/router';
import { AuthGuard } from '@app/auth/auth.guard';
import { AdminDocumentShell } from './admin-document-shell/admin-document-shell';

export const ADMIN_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    component: AdminDocumentShell,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./admin-document-list/admin-document-list').then(
            (m) => m.AdminDocumentList
          ),
      },
      {
        path: 'detail',
        loadComponent: () =>
          import('./admin-document-upload/admin-document-upload').then(
            (m) => m.AdminDocumentUpload
          ),
      },
    ],
  },
];
