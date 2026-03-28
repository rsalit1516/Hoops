import { Injectable, inject } from '@angular/core';
import { LoggerService } from '@app/services/logger.service';

@Injectable({ providedIn: 'root' })
export class Utils {
  private logger = inject(LoggerService);

  showConsole(msg: string) {
    this.logger.log(msg);
  }
}
