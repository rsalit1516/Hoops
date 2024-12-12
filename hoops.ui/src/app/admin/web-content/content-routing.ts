import { Routes } from '@angular/router';
import { PageNotFoundStandAloneComponent } from '@app/app.not-found-standalone.component';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'edit',
    //        component: ContentEditComponent,
    loadComponent: () =>
      import('./components/content-edit/content-edit.component').then(
        (mod) => mod.ContentEditComponent
      ),
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./components/content-list/contentList.component').then(
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

