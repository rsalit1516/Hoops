import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LOGGER_OPTIONS, LoggerOptions } from './logger.tokens';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private options = inject(LOGGER_OPTIONS, {
    optional: true,
  }) as LoggerOptions | null;

  private get isLoggingEnabled() {
    return this.options ? this.options.enableInfo : !environment.production;
  }

  log(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      const prefix =
        this.options?.prefix ?? `[${environment.environment.toUpperCase()}]`;
      console.log(prefix, message, ...args);
    }
  }

  warn(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      const prefix =
        this.options?.prefix ?? `[${environment.environment.toUpperCase()}]`;
      console.warn(prefix, message, ...args);
    }
  }

  error(message: any, ...args: any[]): void {
    // Always log errors, even in production
    const prefix =
      this.options?.prefix ?? `[${environment.environment.toUpperCase()}]`;
    const always = this.options?.alwaysLogErrors ?? true;
    if (always || !environment.production) {
      console.error(prefix, message, ...args);
    }
  }

  debug(message: any, ...args: any[]): void {
    const enableDebug =
      this.options?.enableDebug ??
      (environment.environment === 'local' && !environment.production);
    if (enableDebug) {
      const prefix = this.options?.prefix ?? `[DEBUG]`;
      console.debug(prefix, message, ...args);
    }
  }

  info(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      const prefix =
        this.options?.prefix ?? `[${environment.environment.toUpperCase()}]`;
      console.info(prefix, message, ...args);
    }
  }
}
