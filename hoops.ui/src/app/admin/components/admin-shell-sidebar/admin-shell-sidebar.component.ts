import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FeatureFlagService } from '@app/services/featureFlag.service';

@Component({
  selector: 'app-admin-shell-sidebar',
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
    './../../containers/admin-shell/admin-shell.component.scss']
})
export class AdminShellSidebarComponent {
  readonly #featureFlagService = inject(FeatureFlagService);
  readonly #router = inject(Router);
  showDirectors = this.#featureFlagService.isFeatureEnabled('adminDirectors');
  showHouseholds = this.#featureFlagService.isFeatureEnabled('adminHouseholds');
  showPeople = this.#featureFlagService.isFeatureEnabled('adminPeople');
  showColors = this.#featureFlagService.isFeatureEnabled('adminColors');
  showUsers = this.#featureFlagService.isFeatureEnabled('adminUsers');
  showNotices = this.#featureFlagService.isFeatureEnabled('adminNotices');
  shouldRun = false;

  SeasonSetupSection = 'Season Setup';
  seasonSetupItems = [
    { name: 'Seasons', route: '/admin/seasons', isSelected: false },
    { name: 'Divisions', route: '/admin/division', isSelected: false },
    { name: 'Teams', route: '/admin/season-setup', isSelected: false },
    { name: 'Games', route: '/admin/games', isSelected: false },
  ];
  CommunicationSection = 'Communication';
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

  constructor () { }

  selectedItem: nav | undefined;

  selectItem (item: nav) {
    this.selectedItem = item;

  } isSelected (item: nav): boolean {
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

    this.#router.navigate([item.route]);
  }
}

class nav {
  name!: string;
  route!: string;
  isSelected!: boolean;
}
