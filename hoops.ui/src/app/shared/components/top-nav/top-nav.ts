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
  // Enhanced computed signals
  showAdminMenu = computed(() => {
    const adminModuleEnabled = this.featureFlags.getFlag('adminModule')();
    const isAdmin = this.authService.isAdmin();

    this.logger.log('� Admin module enabled:', adminModuleEnabled);
    this.logger.log('🔐 Is admin user:', isAdmin);

    const showMenu = adminModuleEnabled && isAdmin;
    this.logger.log('📋 Show admin menu result:', showMenu);

    return showMenu;
  });

  // Reactive admin feature flag
  showAdminFeature = this.featureFlags.getFlag('adminModule');
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
