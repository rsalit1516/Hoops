/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { App } from './app/app';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
} else {
  // Enable console logging for development and non-production environments
  console.log(
    '🚀 Console logging enabled for environment:',
    environment.environment
  );
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
