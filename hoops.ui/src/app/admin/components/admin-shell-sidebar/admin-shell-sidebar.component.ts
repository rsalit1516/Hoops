import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-shell-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatDividerModule,
    NgIf,
  ],
  templateUrl: './admin-shell-sidebar.component.html',
  styleUrls: ['./admin-shell-sidebar.component.scss',
    './../../containers/admin-shell/admin-shell.component.scss'],
})
export class AdminShellSidebarComponent {
  showDirectors = false;
  showHouseholds = false;
  showPeople = false;
  showColors = false;
  showUsers = false;
  shouldRun = true;

  SeasonSetupSection = 'Season Setup';
  seasonSetupItems = [
    { name: 'Seasons', route: '/admin/seasons', isSelected: false },
    { name: 'Divisions', route: '/admin/division', isSelected: false },
    { name: 'Teams', route: '/admin/teams', isSelected: false },
    { name: 'Games', route: '/admin/games', isSelected: false },
  ];
  CommunicationSection = 'Communcation';
  communicationItems = [
    { name: 'Notices', route: '/admin/content', isSelected: false },
  ];
  showPeopleSection = false;
  PeopleSection = 'People';
  peopleItems = [
    { name: 'Directors', route: '/admin/director', isSelected: false },
    { name: 'Households', route: '/admin/households', isSelected: false },
    { name: 'People', route: '/admin/people', isSelected: false },
    { name: 'Users', route: '/admin/users', isSelected: false },
    { name: 'Uniform Colors', route: '/admin/colors', isSelected: false },

  ];

  constructor (private router: Router,) { }

  selectedItem: nav| undefined;

  selectItem (item: nav) {
    this.selectedItem = item;

  }  isSelected (item: nav): boolean {
    return item.isSelected;
  }

  navigate (item: nav) {
    this.seasonSetupItems.forEach(i => {
      if (i.name === item.name) {
        i.isSelected = true;
      } else {
        i.isSelected = false;
      }
    });

    this.router.navigate([item.route]);
  }

}

class nav {
  name!: string;
  route!: string;
  isSelected!: boolean;
}
