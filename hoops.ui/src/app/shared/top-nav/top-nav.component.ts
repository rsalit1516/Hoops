import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import * as userActions from '../../user/state/user.actions';
import * as fromUser from '../../user/state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'app/domain/user';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'csbc-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  currentUser$: Observable<User> | undefined;
  userName: string | undefined;
  showAdminMenu: boolean | undefined;
  currentUser: User | undefined;
  drawer!: {
    opened: false;
  };
  env: any;

  constructor(public dialog: MatDialog, private store: Store<fromUser.State>, private route: Router) {
    this.route.events.subscribe(route => console.log(route));
  }

  ngOnInit() {
    this.env = environment.environment;
    console.log(this.env);
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe((user) => {
      // console.log(user);
      if (user !== null && user.userId !== 0) {
        this.currentUser = user;
        if (user) {
          this.userName = user.firstName;
          if (this.env !== 'Production') {
            this.showAdminMenu =
              user.screens == undefined ? false : user.screens.length > 0;
          }
        }
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '320px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
