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
    this.logger.log('🚩 Feature flags loaded:', flags);

    const adminEnabled = !!flags['adminModule'];
    this.logger.log('🔧 Admin module enabled:', adminEnabled);

    const currentUser = this.authService.currentUser(); // signal read ensures reactivity to login/logout
    this.logger.log('👤 Current user:', currentUser);

    const isAdmin = this.#isAdminUser(currentUser ?? undefined);
    this.logger.log('🔐 Is admin user:', isAdmin);

    const showMenu = adminEnabled && isAdmin;
    this.logger.log('📋 Show admin menu result:', showMenu);

    return showMenu;
  });

  // Admin helper aligned with AuthService logic
  #isAdminUser(user: User | undefined): boolean {
    this.logger.log('🔍 Checking admin status for user:', user);
    if (!user) {
      this.logger.log('❌ No user found');
      return false;
    }
    // userType: 2 = Admin, 3 = Director (based on existing checks in AuthService)
    const isAdmin = user.userType === 2 || user.userType === 3;
    this.logger.log(`🎯 User type: ${user.userType}, Is admin: ${isAdmin}`);
    return isAdmin;
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

    // Direct console.log to bypass LoggerService for debugging
    console.log('🔥 DIRECT: Environment = ' + this.env);
    console.log('🔥 DIRECT: Environment object =', environment);
    console.log(
      '🔥 DIRECT: Feature flag path = ' + environment.featureFlagPath
    );
    console.log('🔥 DIRECT: Production flag = ' + environment.production);

    this.logger.log('🌍 Environment = ' + this.env);
    this.logger.log('🚩 Feature flag path = ' + environment.featureFlagPath);
    this.logger.log('🔧 Show Admin Feature = ' + this.showAdminFeature);
    this.logger.log('📋 Show Admin Menu = ' + this.showAdminMenu());
    this.logger.log('🔐 Security enabled = ' + this.securityEnabled);
  }

  // Deprecated: login dialog replaced by routed /login for mobile friendliness

  logout() {
    this.authService.logout();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
