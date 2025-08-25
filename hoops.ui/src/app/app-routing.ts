import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CsbcPhotos } from './photos/csbc-photos';
import { Contacts } from './contacts/contacts';
import { CsbcClubDocs } from './club-docs/csbc-club-docs';
import { Home } from './home/home';
import { PageNotFound } from './app.not-found';
import { GamesResolver } from './games/games.resolver';
import { ADMINROUTES } from './admin/admin-routing';
import { Login } from './shared/components/login/login';
import { adminGuard } from './shared/guards/admin-guard.guard';
import { GAMES_ROUTES } from './games/games-routing.module';

const appRoutes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'games',
    children: GAMES_ROUTES,
    // loadChildren: () =>
    //   import('./games/games-routing.module').then((m) => m.GAMES_ROUTES),
    resolve: { state: GamesResolver },
  },
  {
    path: 'photos',
    component: CsbcPhotos,
  },
  {
    path: 'contacts',
    component: Contacts,
  },
  {
    path: 'clubDocs',
    component: CsbcClubDocs,
  },

  {
    path: 'admin',
    children: ADMINROUTES,
    canActivate: [adminGuard],
  },
  {
    path: 'login',
    component: Login,
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFound },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRouting {}
