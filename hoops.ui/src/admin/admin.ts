import { Component, OnInit, NgZone, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromContent from './state';
import { MatSidenav } from '@angular/material/sidenav';

class MenuItem {
  routerLink: string | undefined;
  description: string | undefined;
}
const SMALL_WIDTH_BREAKPOINT = 720;
@Component({
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss', '../shared/scss/forms.scss'],
  standalone: true,
})
export class Admin implements OnInit {
  readonly sidenav = viewChild(MatSidenav);

  opened = true;
  mode = 'side';
  menuItems!: MenuItem[];
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  constructor() {}
  ngOnInit() {
    // this.user = this.userService.user;
    // TODO: get user types!
    this.menu();
  }
  menu() {
    this.menuItems = new Array<MenuItem>();

    this.menuItems.push({
      routerLink: '/admin/seasons',
      description: 'Seasons',
    });
    this.menuItems.push({
      routerLink: '/admin/division',
      description: 'Divisions',
    });
    this.menuItems.push({
      routerLink: '/admin/content',
      description: 'Front Page Content',
    });
  }
}
