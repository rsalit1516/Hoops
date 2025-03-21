import { Routes } from '@angular/router';
import { PageNotFoundStandAloneComponent } from '@app/app.not-found-standalone.component';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'edit',
    //        component: ContentEditComponent,
    loadComponent: () =>
      import('./content-edit/content-edit.component').then(
        (mod) => mod.ContentEditComponent
      ),
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./content-list/contentList.component').then(
        (mod) => mod.ContentListComponent
      ),
  },

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },

  { path: '**', component: PageNotFoundStandAloneComponent },
];

