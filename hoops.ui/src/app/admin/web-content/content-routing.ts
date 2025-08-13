import { Routes } from '@angular/router';
import { PageNotFoundStandAlone } from '@app/app.not-found-standalone';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'edit',
    //        component: ContentEdit,
    loadComponent: () =>
      import('./content-edit/content-edit').then(
        (mod) => mod.ContentEdit
      ),
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./content-list/contentList').then(
        (mod) => mod.ContentList
      ),
  },

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },

  { path: '**', component: PageNotFoundStandAlone },
];

