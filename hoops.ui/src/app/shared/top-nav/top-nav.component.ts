import { Component, OnInit, output } from '@angular/core';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import * as fromUser from '../../user/state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '@app/domain/user';
import { environment } from '../../../environments/environment';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { Constants } from '../constants';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'csbc-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss', './../../shared/scss/menu.scss'],
    imports: [CommonModule, MatDialogModule, MatToolbarModule,
        MatButtonModule, MatIconModule, RouterModule, RouterLinkActive]
})
export class TopNavComponent implements OnInit {
  public readonly sidenavToggle = output();
  currentUser$: Observable<User> | undefined;
  userName: string | undefined;
  showAdminMenu: boolean | undefined;
  currentUser: User | undefined;
  drawer!: {
    opened: false;
  };
  env: any;
  constants: typeof Constants;
  securityEnabled: boolean = true;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromUser.State>,
    private route: Router
  ) {
    // this.route.events.subscribe(route => console.log(route));
    this.constants = Constants;
  }

  ngOnInit() {
    this.env = environment.environment;
    this.securityEnabled = environment.securityEnabled;
    console.log(this.env);
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe((user) => {
      console.log(user);
      if (this.securityEnabled) {
        if (user !== null && user.userId !== 0) {
          this.currentUser = user;
          if (user) {
            this.userName = user.firstName;
            // if (this.securityEnabled) {
              this.showAdminMenu =
                user.screens == undefined ? false : user.screens.length > 0;
            // }
          }
        }
      } else {
        this.showAdminMenu = true;
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
