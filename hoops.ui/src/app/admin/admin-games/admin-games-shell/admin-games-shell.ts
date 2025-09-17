import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';

// import { GameService } from '@app/services/game.service';
import { Season } from '@app/domain/season';
import { RegularGame } from '@app/domain/regularGame';
import { AdminGameDetail } from '../admin-game-detail/admin-game-detail';
import { AdminGamesPlayoffsList } from '../admin-games-playoffs-list/admin-games-playoffs-list';
import { AdminGamesList } from '../admin-games-list/admin-games-list';
import { NgIf } from '@angular/common';
import { DivisionSelect } from '../../admin-shared/division-select/division-select';
import { GameTypeSelect } from '../../admin-shared/game-type-select/game-type-select';
import { SeasonSelect } from '../../admin-shared/season-select/season-select';
import { ShellTitle } from '@app/shared/components/shell-title/shell-title';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AdminGamesPlayoffsDetail } from '../admin-games-playoffs-detail/admin-games-playoffs-detail';
import { MatButtonModule } from '@angular/material/button';
import { AdminGamesFilter } from '../admin-games-filter/admin-games-filter';
import { AdminGameService } from '../adminGame.service';
import { LoggerService } from '@app/services/logger.service';
import { Router, RouterOutlet } from '@angular/router';
import { AdminGamesState } from '../adminGamesState.service';
@Component({
  selector: 'csbc-admin-games-shell',
  template: `<section class="container">
    <h2>{{ title }}</h2>
    <csbc-admin-games-filter
      (gameFilterChanged)="handlefilterUpdate($event)"
    ></csbc-admin-games-filter>
    <router-outlet></router-outlet>
  </section>`,

  styleUrls: [
    './admin-games-shell.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  imports: [
    // MatToolbarModule,
    RouterOutlet,

    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    SeasonSelect,
    GameTypeSelect,
    DivisionSelect,
    NgIf,
    AdminGamesList,
    AdminGamesPlayoffsList,
    AdminGameDetail,
    ShellTitle,
    AdminGamesPlayoffsDetail,
    AdminGamesFilter,
  ],
})
export class AdminGamesShell implements OnInit {
  private logger = inject(LoggerService);
  router = inject(Router);
  readonly gameService = inject(AdminGameService);
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
        this.router.navigate(['admin/games/list-playoff']);
        this.logger.info('Playoff games are shown');
      } else {
        this.showPlayoffs.set(false);
        this.showRegularSeason.set(true);
        this.router.navigate(['admin/games/list']);
        this.logger.info('Regular season games are shown');
      }
    });
  }

  ngOnInit(): void {
    this.gameService.filteredGames();
    this.logger.debug(
      'Filtered games signal',
      this.gameService.filteredGames()
    );
    // console.log((gameType === 'Regular Season'));
    // this.showPlayoffs = (gameType === 'Playoffs');
    // this.showRegularSeason = (gameType === 'Regular Season');
    // if (gameType !== undefined) {
    //   console.log('Calling filtered games');
    //   this.#store.dispatch(new adminActions.LoadDivisionGames());
    //   this.#store.dispatch(new adminActions.LoadDivisionTeams());
    //   this.#store.dispatch(new adminActions.LoadPlayoffGames());
    // }
  }
  selectedSeason(season: Season) {
    // this.store.dispatch(new adminActions.SetCurrentSeason(season));
  }
  clickedDivision(division: MouseEvent) {
    // TODO: need to change the parameter
    this.logger.debug('Clicked division', division);
  }
  newGame() {}
  closeSidenav() {
    this.isSidenavOpen = false;
  }
  handlefilterUpdate($event: any) {
    // console.log($event);
    // console.log($event.division);
    // console.log($event.season);
    // this.logger.log($event.gametType);
    // if ($event.gameType === 'Playoffs') {
    //   this.showPlayoffs = true;
    //   this.showRegularSeason = false;
    // } else {
    //   this.showPlayoffs = false;
    //   this.showRegularSeason = true;
    // }
  }
}
