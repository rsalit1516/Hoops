import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message: any, ...optionalParams: any[]): void {
    if (!environment.production) {
      console.log(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]): void {
    if (!environment.production) {
      console.error(message, ...optionalParams);
    }
  }

  // Add more methods as needed (warn, info, debug, etc.)
}
