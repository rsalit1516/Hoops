import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import * as userActions from '../../user/state/user.actions';
import * as fromUser from '../../user/state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'app/domain/user';

@Component({
  selector: 'csbc-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  currentUser$: Observable<User>;
  userName = '';
  showAdminMenu = false;
  currentUser: User;
  drawer: {
    opened: false;
  };

  constructor(public dialog: MatDialog, private store: Store<fromUser.State>) {}

  ngOnInit() {
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe(user => {
      // console.log(user);
      if (user !== null && user.userId !== 0) {
        this.currentUser = user;
        if (user) {
          this.userName = user.firstName;
          this.showAdminMenu = user.screens.length > 0;
        }
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '320px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
