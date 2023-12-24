import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentShellComponent } from './containers/content-shell/content-shell.component';
import { PageNotFoundComponent } from '@app/app.not-found.component';
import { ContentEditComponent } from './components/content-edit/content-edit.component';
import { ContentListComponent } from './components/content-list/contentList.component';
import { PageNotFoundStandAloneComponent } from '@app/app.not-found-standalone.component';

export const CONTENT_ROUTES: Routes = [
  {
    path: '',
    component: ContentShellComponent,
    children: [
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
        //      component: ContentListComponent,
        loadComponent: () =>
          import('./components/content-list/contentList.component').then(
            (mod) => mod.ContentListComponent
          ),
      },
      {
        path: '',
        redirectTo: '/list',
        pathMatch: 'full',
      },

      { path: '**', component: PageNotFoundStandAloneComponent },
    ]
  }
];

