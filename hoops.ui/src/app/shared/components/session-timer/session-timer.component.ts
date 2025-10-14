import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'csbc-session-timer',
  template: `
    <div
      class="session-timer"
      [class.expiring-soon]="sessionInfo().isExpiringSoon"
      [matTooltip]="tooltipText()"
      *ngIf="authService.isLoggedIn()"
    >
      <mat-icon>access_time</mat-icon>
      <span class="time">{{ sessionInfo().timeRemaining }}</span>
    </div>
  `,
  styles: [
    `
      .session-timer {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 12px;
        transition: all 0.3s ease;
      }

      .session-timer.expiring-soon {
        background-color: rgba(255, 193, 7, 0.2);
        color: #ffc107;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
        100% {
          opacity: 1;
        }
      }

      .time {
        font-weight: 500;
        font-family: 'Courier New', monospace;
      }

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    `,
  ],
  imports: [CommonModule, MatTooltipModule, MatIconModule],
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
