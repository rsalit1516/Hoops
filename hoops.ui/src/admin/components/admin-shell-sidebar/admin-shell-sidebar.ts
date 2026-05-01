import { Component, inject, Inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FeatureFlagService } from '@app/shared/services/feature-flags';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'app-admin-shell-sidebar',
  imports: [MatListModule, RouterLink, RouterLinkActive, MatDividerModule],
  templateUrl: './admin-shell-sidebar.html',
  styleUrls: [
    './admin-shell-sidebar.scss',
    './../../containers/admin-shell/admin-shell.scss',
  ],
})
export class AdminShellSidebar {
  readonly #featureFlagService = inject(FeatureFlagService);
  readonly #router = inject(Router);
  readonly #logger = inject(LoggerService);
  showDirectors = this.#featureFlagService.isEnabled('adminDirectors');
  showHouseholds = this.#featureFlagService.isEnabled('adminHouseholds');
  showPeople = this.#featureFlagService.isEnabled('adminPeople');
  showColors = this.#featureFlagService.isEnabled('adminColors');
  showUsers = this.#featureFlagService.isEnabled('adminUsers');
  showNotices = this.#featureFlagService.isEnabled('adminNotices');
  shouldRun = false;

  SeasonSetupSection = 'Season Setup';
  seasonSetupItems = [
    { name: 'Seasons', route: '/admin/seasons', isSelected: false },
    { name: 'Divisions', route: '/admin/division', isSelected: false },
    { name: 'Players', route: '/admin/players', isSelected: false },
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
    { name: 'Sponsors', route: '/admin/sponsors', isSelected: false },
    { name: 'Users', route: '/admin/users', isSelected: false },
    { name: 'Documents', route: '/admin/documents', isSelected: false },
    { name: 'Uniform Colors', route: '/admin/colors', isSelected: false },
  ];

  ReportsSection = 'Reports';
  reportsItems = [
    {
      name: 'Draft List',
      route: '/admin/reports/draft-list',
      isSelected: false,
    },
  ];
  showReports = true;

  constructor() {}

  selectedItem: nav | undefined;

  selectItem(item: nav) {
    this.selectedItem = item;
  }
  isSelected(item: nav): boolean {
    return item.isSelected;
  }

  navigate(item: nav) {
    this.#logger.info('Navigating to:', item.route);
    this.seasonSetupItems.forEach((i) => {
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
