import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'csbc-session-timer',
  template: `
    @if (authService.isLoggedIn()) {
      <div
        class="session-timer"
        [class.expiring-soon]="sessionInfo().isExpiringSoon"
        [matTooltip]="tooltipText()"
        >
        <mat-icon>access_time</mat-icon>
        <span class="time">{{ sessionInfo().timeRemaining }}</span>
      </div>
    }
    `,
  styleUrls: ['./session-timer.component.scss'],
  imports: [MatTooltipModule, MatIconModule],
})
export class SessionTimerComponent {
  authService = inject(AuthService);

  sessionInfo = computed(() => this.authService.getSessionInfo());

  tooltipText = computed(() => {
    const info = this.sessionInfo();
    if (info.isExpiringSoon) {
      return `Your session will expire in ${info.timeRemaining}. Continue using the app to extend your session.`;
    }
    return `Session expires in ${info.timeRemaining}`;
  });
}
