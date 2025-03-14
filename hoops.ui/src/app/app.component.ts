import { Component, inject, OnInit, output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { Store, select } from '@ngrx/store';
import * as gameActions from './games/state/games.actions';
import * as fromGames from './games/state';
import { GameService } from './services/game.service';


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
  public readonly sidenavToggle = output();
  title = 'CSBC Hoops';

  constructor() {
    this.#gameStore.select(fromGames.getCurrentSeason).subscribe((season) => {
      console.log('Current season from app start: ', season);
      if (season!.seasonId !== 0) {
        // this.#gameStore.dispatch(new gameActions.LoadDivisions());
        // this.#gameStore.dispatch(new gameActions.LoadTeams());
        this.#gameStore.dispatch(new gameActions.LoadGames());
        this.#gameService.fetchSeasonGames();
      }
    });
  }
  ngOnInit() {
    this.#gameStore.dispatch(new gameActions.LoadCurrentSeason());
      this.#router.navigate([''])
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
