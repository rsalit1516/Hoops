import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private isLoggingEnabled = !environment.production;

  log(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.log(
        `[${environment.environment.toUpperCase()}]`,
        message,
        ...args
      );
    }
  }

  warn(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.warn(
        `[${environment.environment.toUpperCase()}]`,
        message,
        ...args
      );
    }
  }

  error(message: any, ...args: any[]): void {
    // Always log errors, even in production
    console.error(
      `[${environment.environment.toUpperCase()}]`,
      message,
      ...args
    );
  }

  debug(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled && environment.environment === 'local') {
      console.debug(`[DEBUG]`, message, ...args);
    }
  }

  info(message: any, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.info(
        `[${environment.environment.toUpperCase()}]`,
        message,
        ...args
      );
    }
  }
}
