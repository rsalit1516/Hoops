/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from './environments/environment';
import { App } from './app/app';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './app/reducers';
import { StoreModule } from '@ngrx/store';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginRoutingModule } from './app/login-routing.module';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { DataService } from './app/services/data.service';

if (environment.production) {
  enableProdMode();
  // Override console methods to disable them in production
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserModule,
      AppRoutingModule,
      // HomeModule,
      // GamesModule,
      // AdminModule,
      LoginRoutingModule,
      LayoutModule,
      // UserModule,
      StoreModule.forRoot(reducers, { metaReducers }),
      // StoreModule.forRoot({}),
      StoreDevtoolsModule.instrument({
        name: 'CSBC Site',
        maxAge: 25,
        logOnly: environment.production
        , connectInZone: true
      }),
      // StoreModule.forRoot(reducers, { metaReducers }),
      EffectsModule.forRoot([]), StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      }), StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, connectInZone: true })),
    DataService,
    // SeasonService,
    //DivisionService,
    //TeamService,
    // GameService,

    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
