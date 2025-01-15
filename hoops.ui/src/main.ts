/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './app/reducers';
import { StoreModule } from '@ngrx/store';
import { UserModule } from './app/user/user.module';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginRoutingModule } from './app/login-routing.module';
import { AdminModule } from './app/admin/admin.module';
import { GamesModule } from './app/games/games.module';
import { HomeModule } from './app/home/home.module';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { DataService } from './app/services/data.service';
import { TeamService } from './app/services/team.service';
import { DivisionService } from './app/services/division.service';
import { SeasonService } from './app/services/season.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, HomeModule, GamesModule, AdminModule, LoginRoutingModule, LayoutModule, UserModule, UserModule, StoreModule.forRoot(reducers, { metaReducers }),
        // StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            name: 'CSBC Site',
            maxAge: 25,
            logOnly: environment.production
        , connectInZone: true}),
        // StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([]), StoreModule.forRoot({}, {
            runtimeChecks: {
                strictStateImmutability: false,
                strictActionImmutability: false,
            },
        }), StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production , connectInZone: true})),
        SeasonService,
        DivisionService,
        TeamService,
        // GameService,
        DataService,
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
