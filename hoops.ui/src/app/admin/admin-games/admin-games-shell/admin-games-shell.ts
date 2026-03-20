import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';

// import { GameService } from '@app/services/game.service';
import { Season } from '@app/domain/season';
import { RegularGame } from '@app/domain/regularGame';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { AdminGamesFilter } from '../admin-games-filter/admin-games-filter';
import { AdminGameService } from '../adminGame.service';
import { LoggerService } from '@app/services/logger.service';
import { Router, RouterOutlet } from '@angular/router';
import { AdminGamesState } from '../adminGamesState.service';
import { GameService } from '@app/services/game.service';
@Component({
  selector: 'csbc-admin-games-shell',
  template: `<section class="container">
    <h2>{{ title }}</h2>
    <csbc-admin-games-filter (gameFilterChanged)="handlefilterUpdate($event)" />
    <router-outlet />
  </section>`,

  styleUrls: [
    './admin-games-shell.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    AdminGamesFilter,
  ],
})
export class AdminGamesShell implements OnInit {
  private logger = inject(LoggerService);
  router = inject(Router);
  readonly gameService = inject(AdminGameService);
  private readonly regularGameService = inject(GameService);
  private store = inject(Store<fromAdmin.State>);
  state = inject(AdminGamesState);

  pageTitle = 'Game Management';
  title = 'Game Management';
  isSidenavOpen = false;
  seasons$ = this.store.select(fromAdmin.getSeasons);
  divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  showRegularSeason = signal<boolean>(true);
  showPlayoffs = signal<boolean>(false);
  games: RegularGame[] | undefined;

  selectedRecord = signal<RegularGame | null>(null);
  // this.gameService.selectedRecordSignal();

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('firstPanel') firstPanel!: MatExpansionPanel;

  constructor() {
    effect(() => {
      const record = this.gameService.selectedRecordSignal();
      this.logger.info('Selected record changed', record);
      if (record !== null) {
        this.logger.debug('Record updated', record.scheduleGamesId);
        this.selectedRecord.set(record);
        this.isSidenavOpen = true;
        // Allow the sidenav to open first, then expand the first panel
        setTimeout(() => {
          if (this.firstPanel) {
            this.firstPanel.expanded = true;
          }
        }, 300);
      }
    });
    effect(() => {
      if (this.state.gameType() === 'playoff') {
        this.showPlayoffs.set(true);
        this.showRegularSeason.set(false);
        // Only navigate to list-playoff if we're currently on the regular season list
        // Don't interrupt detail/edit views
        untracked(() => {
          if (this.router.url.includes('/admin/games/list') &&
              !this.router.url.includes('list-playoff')) {
            this.router.navigate(['admin/games/list-playoff']);
            this.logger.info('Playoff games are shown');
          }
        });
      } else {
        this.showPlayoffs.set(false);
        this.showRegularSeason.set(true);
        // Only navigate to list if we're currently on the playoff list
        // Don't interrupt detail/edit views
        untracked(() => {
          if (this.router.url.includes('/admin/games/list-playoff')) {
            this.router.navigate(['admin/games/list']);
            this.logger.info('Regular season games are shown');
          }
        });
      }
    });
  }

  ngOnInit(): void {
    // Admin games currently has no team selector; ensure we don't silently
    // filter by whatever TeamService auto-selected (often teamId=1).
    this.regularGameService.ignoreTeamFilter.set(true);
    this.gameService.filteredGames();
    this.logger.debug(
      'Filtered games signal',
      this.gameService.filteredGames()
    );
  }

  ngOnDestroy(): void {
    this.regularGameService.ignoreTeamFilter.set(false);
  }
  selectedSeason(season: Season) {}
  clickedDivision(division: MouseEvent) {
    // TODO: need to change the parameter
    this.logger.debug('Clicked division', division);
  }
  newGame() {}
  closeSidenav() {
    this.isSidenavOpen = false;
  }
  handlefilterUpdate($event: any) {}
}
