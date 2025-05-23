import { Component, OnInit, output } from '@angular/core';
import * as fromUser from '../../user/state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '@app/domain/user';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'csbc-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.css'],
    imports: [MatListModule, MatIconModule, RouterLink, NgIf]
})
export class SidenavListComponent implements OnInit {
  readonly sidenavClose = output();
  showAdminMenu = false;
  currentUser: User | undefined;
  userName: string | undefined;

  constructor(private store: Store<fromUser.State>) { }

  ngOnInit() {
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe(user => {
      // console.log(user);
      if (user !== null && user.userId !== 0) {
        this.currentUser = user;
        if (user) {
          this.userName = user.firstName;
          this.showAdminMenu = user.screens == undefined ? false :
            this.showAdminMenu = user.screens.length > 0;
        }
      }
    });
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
