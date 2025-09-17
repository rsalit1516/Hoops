import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app-routing';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginRoutingModule } from './login-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';
import { DataService } from './services/data.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRouting,
      LoginRoutingModule,
      LayoutModule,
      StoreModule.forRoot(reducers, {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      }),
      EffectsModule.forRoot([]),
      StoreDevtoolsModule.instrument({
        name: 'CSBC Site',
        maxAge: 25,
        logOnly: environment.production,
        connectInZone: true,
      })
    ),
    DataService,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
