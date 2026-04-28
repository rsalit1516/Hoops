import {
  Component,
  computed,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import * as adminActions from '../../state/admin.actions';
import * as contentActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';
import { ColorService } from '@app/admin/admin-shared/services/color.service';

import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LocationService } from '@app/services/location.service';
import { AdminShellSidebar } from '@app/admin/components/admin-shell-sidebar/admin-shell-sidebar';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-admin-shell',
  template: `
    <mat-sidenav-container class="admin-sidenav-container">
      <mat-sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="sidenavOpened()"
        (openedChange)="isOpen.set($event)"
        class="admin-sidenav"
      >
        <app-admin-shell-sidebar />
      </mat-sidenav>
      <mat-sidenav-content class="admin-sidenav-content">
        <div class="flex items-center md:hidden menu-toggle-bar">
          <button
            mat-icon-button
            (click)="isOpen.set(!isOpen())"
            aria-label="Toggle navigation"
          >
            <mat-icon>menu</mat-icon>
          </button>
        </div>
        <div class="px-4 shell-content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./admin-shell.scss'],
  imports: [
    AdminShellSidebar,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
  ],
})
export class AdminShell implements OnInit {
  isMobile = signal(window.innerWidth < 768);
  isOpen = signal(false);
  sidenavOpened = computed(() => !this.isMobile() || this.isOpen());

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  events: string[] = [];
  shouldRun = true;
  private seasonService = inject(SeasonService);
  private colorService = inject(ColorService);
  private logger = inject(LoggerService);
  locationService = inject(LocationService);
  store = inject(Store<fromAdmin.State>);
  divisionService = inject(DivisionService);
  readonly #router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.logger.debug('AdminShell ngOnInit');
    this.seasonService.fetchSeasons();

    this.seasonService.getCurrentSeason().subscribe((season) => {
      this.seasonService.updateSelectedSeason(season!);
      this.logger.debug('Selected season:', this.seasonService.selectedSeason);
    });
    this.colorService.fetchColors();
    this.locationService.fetchLocations();

    // Close drawer after navigation on mobile
    this.#router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile()) {
          this.isOpen.set(false);
        }
      });
  }
}
