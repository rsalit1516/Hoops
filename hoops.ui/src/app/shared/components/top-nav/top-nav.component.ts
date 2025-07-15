import { Component, computed, inject, OnInit, output } from '@angular/core';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { Observable } from 'rxjs';
import { User } from '@app/domain/user';
import { environment } from '../../../../environments/environment';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { Constants } from '../../constants';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/services/auth.service';
import { FeatureFlagService } from '../../services/feature-flags';

@Component({
  selector: 'csbc-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss',
    './../../../shared/scss/menu.scss'],
  imports: [CommonModule, MatDialogModule, MatToolbarModule,
    MatButtonModule, MatIconModule, RouterModule, RouterLinkActive]
})
export class TopNavComponent implements OnInit {
  public dialog = inject(MatDialog);
  public readonly sidenavToggle = output();
  private authService = inject(AuthService);
  private featureFlags = inject(FeatureFlagService);

  currentUser$: Observable<User> | undefined;
  userName: string | undefined;
  user = computed(() => this.authService.currentUser());
  drawer!: {
    opened: false;
  };
  env: any;
  constants: typeof Constants;
  securityEnabled: boolean = true;
  showAdminMenu = false;
  get showAdmin (): boolean {
    return this.featureFlags.isEnabled('adminModule');
  }
  constructor () {
    // this.route.events.subscribe(route => console.log(route));
    this.constants = Constants;
  }

  ngOnInit () {
    this.env = environment.environment;
    this.securityEnabled = environment.securityEnabled;

    if (this.securityEnabled) {
      if (this.user()) {
        this.userName = this.user()!.firstName;
        // if (this.securityEnabled) {
        this.showAdminMenu =
          this.showAdmin && (this.user()!.screens == undefined ? false : this.user()!.screens!.length > 0);
        // }
      }

    } else {
      this.showAdminMenu = true;
    }
    console.log('Environment = ' + this.env);
    console.log('Show Admin = ' + this.showAdmin);
    console.log('Show Admin Menu = ' + this.showAdminMenu);

  }

  openDialog () {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
