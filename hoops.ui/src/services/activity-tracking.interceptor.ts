import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { UserActivityService } from './user-activity.service';
import { LoggerService } from './logger.service';

@Injectable()
export class ActivityTrackingInterceptor implements HttpInterceptor {
  private userActivityService = inject(UserActivityService);
  private logger = inject(LoggerService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Record activity for API calls (except auth-related endpoints to avoid loops)
    const isAuthEndpoint = req.url.includes('/api/auth/');

    if (!isAuthEndpoint) {
      this.userActivityService.recordActivity();
      this.logger.debug('🌐 API activity recorded for:', req.url);
    }

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          // Could track successful responses here if needed
        },
        error: (error) => {
          // Could track errors here if needed
          this.logger.debug('❌ API error for:', req.url, error);
        },
      }),
      finalize(() => {
        // Could track request completion here if needed
      })
    );
  }
}
