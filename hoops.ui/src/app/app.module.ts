import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

/* ngrx */
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppEffects } from './state/app.effects';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { GamesModule } from './games/games.module';
import { CsbcClubDocsModule } from './club-docs/csbc-club-docs.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

// import { CsbcGamesComponent} from './csbc-games/csbc-games.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { CsbcPhotosComponent } from './photos/csbc-photos.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AdminModule } from './admin/admin.module';

import { SeasonService } from './services/season.service';
import { DivisionService } from './services/division.service';
import { TeamService } from './services/team.service';
import { GameService } from './services/game.service';
import { DataService } from './services/data.service';
// import { PageNotFoundComponent } from './app.not-found.component';
import { GamesPipe } from './games.pipe';
import { LayoutModule } from '@angular/cdk/layout';
import { CsbcDashboardComponent } from './csbc-dashboard/csbc-dashboard.component';

import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';
import { LoginDialogComponent } from './shared/login-dialog/login-dialog.component';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { SponsorsModule } from './admin/sponsors/sponsors.module';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SidenavListComponent,
    CsbcPhotosComponent,
    ContactsComponent,
    LoginComponent,
    GamesPipe,
    CsbcDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    HomeModule,
    GamesModule,
    CsbcClubDocsModule,
    SharedModule,
    AdminModule,
    LoginRoutingModule,
    LayoutModule,
    UserModule,
    SponsorsModule,
    UserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    // StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      name: 'CSBC Site',
      maxAge: 25,
      logOnly: environment.production
    }),
    // StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),

  ],

  providers: [
    SeasonService,
    DivisionService,
    TeamService,
    // GameService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
