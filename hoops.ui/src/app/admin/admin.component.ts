import { Component, OnInit, NgZone, viewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromContent from './state';
import * as contentActions from './state/admin.actions';
import { MatSidenav } from '@angular/material/sidenav';
import * as adminActions from './state/admin.actions';
import * as fromAdmin from './state';
import * as fromUser from '../user/state';

class MenuItem {
  routerLink: string | undefined;
  description: string | undefined;
}
const SMALL_WIDTH_BREAKPOINT = 720;
@Component({
    templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss',
    '../shared/scss/forms.scss',
    ],
    standalone: true
})


export class AdminComponent  implements OnInit {
  readonly sidenav = viewChild(MatSidenav);

  opened = true;
  mode = 'side';
  menuItems!: MenuItem[];
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  options: UntypedFormGroup;

  constructor(zone: NgZone, private router: Router, fb: UntypedFormBuilder,     private store: Store<fromContent.State>
    ) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }
  ngOnInit() {
    this.store.dispatch(new contentActions.LoadAdminContent());

    // this.userService.isLoggedIn.subscribe(f => {
    //   console.log(f);
    //   this.isLoggedin = f;
    //   this.router.navigate(['/login']);
    // });

    // this.user = this.userService.user;
    // TODO: get user types!
    this.menu();
    // this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
    //   console.log(season);
    //   if (season !== undefined) {
    //     this.store.dispatch(new adminActions.LoadDivisions());
    //     this.store.dispatch(new adminActions.LoadSeasonTeams());
    //   }
    // });

    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      console.log(division);
      if (division !== undefined) {
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });

    this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
      console.log(divisions);
      this.store.dispatch(new adminActions.SetSelectedDivision(divisions[0]));
      this.store.dispatch(new adminActions.LoadDivisionTeams);
    });
    this.store.select(fromAdmin.getSelectedTeam).subscribe((team) => {
      console.log(team);
      this.store.dispatch(new adminActions.LoadTeamGames);
    });
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
