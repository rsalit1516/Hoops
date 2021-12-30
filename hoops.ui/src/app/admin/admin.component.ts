import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromContent from './content/state';
import * as contentActions from './content/state/content.actions';
import { MatSidenav } from '@angular/material/sidenav';


class MenuItem {
  routerLink: string;
  description: string;
}
const SMALL_WIDTH_BREAKPOINT = 720;
@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})


export class AdminComponent  implements OnInit {
  @ViewChild(MatSidenav, {static: false}) sidenav: MatSidenav;

  opened: true;
  mode = 'side';
  menuItems: MenuItem[];
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  options: FormGroup;

  constructor(zone: NgZone, private router: Router, fb: FormBuilder,     private store: Store<fromContent.State>
    ) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }
  ngOnInit() {
    this.store.dispatch(new contentActions.Load());

    // this.userService.isLoggedIn.subscribe(f => {
    //   console.log(f);
    //   this.isLoggedin = f;
    //   this.router.navigate(['/login']);
    // });

    // this.user = this.userService.user;
    // TODO: get user types!
    this.menu();
  }
    menu() {
    this.menuItems = new Array<MenuItem>();

    this.menuItems.push({
      routerLink: '/admin/seasons',
      description: 'Seasons'
    });
    this.menuItems.push({
      routerLink: '/admin/division',
      description: 'Divisions'
    });
    this.menuItems.push({
      routerLink: '/admin/content',
      description: 'Front Page Content'
    });
  }
}
