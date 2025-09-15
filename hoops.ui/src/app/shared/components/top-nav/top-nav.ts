import { Component, computed, inject, OnInit, output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/domain/user';
import { environment } from '../../../../environments/environment';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { Constants } from '../../constants';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/services/auth.service';
import { FeatureFlagService } from '../../services/feature-flags';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-top-nav',
  templateUrl: './top-nav.html',
  styleUrls: ['./top-nav.scss', './../../../shared/scss/menu.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    RouterLinkActive,
  ],
})
export class TopNav implements OnInit {
  public readonly sidenavToggle = output();
  private authService = inject(AuthService);
  private featureFlags = inject(FeatureFlagService);
  private logger = inject(LoggerService);

  userName: string | undefined;
  user = computed(() => this.authService.currentUser());
  drawer!: {
    opened: false;
  };
  env: any;
  constants: typeof Constants;
  securityEnabled: boolean = true;
  // Show Admin menu when the feature flag is on and the logged-in user is an admin (userType 2 or 3)
  showAdminMenu = computed(() => {
    const flags = this.featureFlags.flags(); // signal read ensures reactivity to flag changes
    this.logger.log('Feature flags:', flags);
    const adminEnabled = !!flags['adminModule'];
    const currentUser = this.authService.currentUser(); // signal read ensures reactivity to login/logout
    this.logger.log('Current user:', currentUser);
    return adminEnabled && this.#isAdminUser(currentUser ?? undefined);
  });

  // Admin helper aligned with AuthService logic
  #isAdminUser(user: User | undefined): boolean {
    if (!user) return false;
    // userType: 2 = Admin, 3 = Director (based on existing checks in AuthService)
    return user.userType === 2 || user.userType === 3;
  }
  get showAdminFeature(): boolean {
    return this.featureFlags.isEnabled('adminModule');
  }
  constructor() {
    // this.route.events.subscribe(route => console.log(route));
    this.constants = Constants;
  }

  ngOnInit() {
    this.env = environment.environment;
    this.securityEnabled = environment.securityEnabled;

    this.logger.log('Environment = ' + this.env);
    this.logger.log('Show Admin = ' + this.showAdminFeature);
    this.logger.log('Show Admin Menu = ' + this.showAdminMenu());
  }

  // Deprecated: login dialog replaced by routed /login for mobile friendliness

  logout() {
    this.authService.logout();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
