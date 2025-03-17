import { Component, computed, effect, inject, OnInit, output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { Store, select } from '@ngrx/store';
import * as gameActions from './games/state/games.actions';
import * as fromGames from './games/state';
import { GameService } from './services/game.service';
import { SeasonService } from './services/season.service';
import { LoggerService } from './services/logging.service';
import { DivisionService } from './services/division.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
  imports: [SidenavListComponent,
    TopNavComponent, RouterOutlet,
    MatSidenavModule, MatNativeDateModule]
})
export class AppComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #gameStore = inject(Store<fromGames.State>);
  readonly #gameService = inject(GameService);
  readonly #seasonService = inject(SeasonService);
  readonly #divisionService = inject(DivisionService);
  readonly #logger = inject(LoggerService);
  public readonly sidenavToggle = output();
  title = 'CSBC Hoops';
  season = computed(() => this.#seasonService.selectedSeason);

  constructor () {
    effect(() => {
      const season = this.season();
      this.#logger.log(season);

      if ((season !== undefined) && (season.seasonId !== undefined) && (season.seasonId !== 0)) {
        //         this.#divisionService.getSeasonDivisions(season!.seasonId!);
        // this.#gameStore.dispatch(new gameActions.LoadGames());
        //        this.#gameService.fetchSeasonGames();
      }
    });
  }
  ngOnInit () {
    // this.#gameStore.dispatch(new gameActions.LoadCurrentSeason());
    this.#seasonService.fetchCurrentSeason();
    this.#router.navigate([''])
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
