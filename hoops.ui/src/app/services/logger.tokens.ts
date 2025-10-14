import { InjectionToken } from '@angular/core';

export interface LoggerOptions {
  enableInfo: boolean;
  enableDebug: boolean;
  prefix: string;
  alwaysLogErrors: boolean;
}

export const LOGGER_OPTIONS = new InjectionToken<LoggerOptions>(
  'LOGGER_OPTIONS'
);
