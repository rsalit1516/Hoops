import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CsbcPhotosComponent } from './photos/csbc-photos.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CsbcClubDocsComponent } from './club-docs/csbc-club-docs.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './app.not-found.component';
import { CsbcDashboardComponent } from './csbc-dashboard/csbc-dashboard.component';
import { GamesResolver } from './games/games.resolver';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'games',
    loadChildren: () =>
      import('./games/games.module').then(mod => mod.GamesModule),
      resolve: {state: GamesResolver}
  },
  {
    path: 'photos',
    component: CsbcPhotosComponent
  },
  {
    path: 'contacts',
    component: ContactsComponent
  },
  {
    path: 'clubDocs',
    component: CsbcClubDocsComponent
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: 'dashboard',
    component: CsbcDashboardComponent
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
