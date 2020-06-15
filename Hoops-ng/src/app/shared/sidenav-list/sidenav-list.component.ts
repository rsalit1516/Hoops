import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as fromUser from '../../user/state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'app/domain/user';

@Component({
  selector: 'csbc-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  showAdminMenu = false;
  currentUser: User;
  userName = '';

  constructor(private store: Store<fromUser.State>) {}

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

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
