import { Component, computed, inject, OnInit, output } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopNav } from './shared/components/top-nav/top-nav';
import { SidenavList } from './shared/components/sidenav-list/sidenav-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SeasonService } from './services/season.service';
import { ContentService } from './admin/web-content/content.service';
import { FeatureFlagService } from './shared/services/feature-flags';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: "./app.html",
  styleUrls: [
    './app.scss'
  ],
  imports: [SidenavList,
    TopNav, RouterOutlet,
    MatSidenavModule, MatNativeDateModule, MatDialogModule]
})
export class App implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private contentService = inject(ContentService);
  private seasonService = inject(SeasonService);
  private featureFlags = inject(FeatureFlagService);
  private authService = inject(AuthService);  // Initialize auth service to restore session from localStorage
  public readonly sidenavToggle = output();
  title = 'CSBC Hoops';
  season = computed(() => this.seasonService.selectedSeason);

  constructor () {
    this.featureFlags.isEnabled('adminModule');
    // AuthService constructor will automatically check localStorage and restore session

    // Defensive: close any orphaned CDK overlay dialogs on each navigation.
    // On dev, failed API calls during dialog component init can leave a backdrop
    // div in the DOM with no visible content, blocking all clicks underneath.
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      if (this.dialog.openDialogs.length > 0) {
        this.dialog.closeAll();
      }
    });
  }
  ngOnInit () {
    this.seasonService.fetchCurrentSeason();
    this.contentService.fetchAllContents();
    this.router.navigate([''])
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
