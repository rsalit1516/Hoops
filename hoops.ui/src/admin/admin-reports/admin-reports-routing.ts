import { RouterModule, Routes } from '@angular/router';
import { PageNotFound } from '@app/app.not-found';
import { AuthGuard } from '@app/auth/auth.guard';
import { DraftList } from './draft-list/draft-list';
import { DailyScheduleReport } from './daily-schedule/daily-schedule';

export const ADMIN_REPORTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'draft-list', component: DraftList },
      { path: 'daily-schedule', component: DailyScheduleReport },
      { path: '', redirectTo: 'draft-list', pathMatch: 'full' },
      { path: '**', component: PageNotFound }
    ]
  }
];

export const AdminReportsRoutingModule = RouterModule.forChild(ADMIN_REPORTS_ROUTES);
