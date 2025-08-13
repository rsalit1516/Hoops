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

  userName: string | undefined;
  user = computed(() => this.authService.currentUser());
  drawer!: {
    opened: false;
  };
  env: any;
  constants: typeof Constants;
  securityEnabled: boolean = true;
  showAdminMenu = computed(() => {
    if (!this.securityEnabled) return true;
    const currentUser = this.user();
    return (
      this.showAdmin && currentUser && (currentUser.screens?.length ?? 0) > 0
    );
  });
  get showAdmin(): boolean {
    return this.featureFlags.isEnabled('adminModule');
  }
  constructor() {
    // this.route.events.subscribe(route => console.log(route));
    this.constants = Constants;
  }

  ngOnInit() {
    this.env = environment.environment;
    this.securityEnabled = environment.securityEnabled;

    console.log('Environment = ' + this.env);
    console.log('Show Admin = ' + this.showAdmin);
    console.log('Show Admin Menu = ' + this.showAdminMenu());
  }

  // Deprecated: login dialog replaced by routed /login for mobile friendliness

  logout() {
    this.authService.logout();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
