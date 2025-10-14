import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { Subject, Observable, Subscription } from 'rxjs';
import {
  NavigationEnd,
  Router,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { Division } from '@app/domain/division';
import { SeasonService } from '@app/services/season.service';
import { GameService } from '@app/services/game.service';
import { Season } from '@app/domain/season';
import { Team } from '@app/domain/team';
// removed duplicate Router import
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { GameFilter } from '../game-filter/game-filter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { PlayoffGameService } from '@app/services/playoff-game.service';

@Component({
  selector: 'csbc-games-top-menu',
  templateUrl: './games-top-menu.html',
  styleUrls: ['../../../shared/scss/select.scss', './games-top-menu.scss'],
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    MatToolbarModule,
    MatTabsModule,
    GameFilter,
  ],
})
export class GamesTopMenu implements OnInit, OnDestroy {
  private routeSub?: Subscription;
  private router = inject(Router);
  private store = inject(Store<fromGames.State>);

  divisions = input.required<Division[]>();
  // Team list now comes from TeamService; no direct input needed here.
  @Output() currentDivision: Division | undefined;
  display = signal<string>('schedule');
  readonly selectedDivision = output<Division>();
  private errorMessageSubject = new Subject<string>();
  private readonly seasonService = inject(SeasonService);
  readonly #gameService = inject(GameService);
  readonly #playoffGameService = inject(PlayoffGameService);
  filteredTeams!: Team[];
  selectedDivisionId$: Observable<number> | undefined;
  season: Season | undefined;
  divisionPlayoffGames = computed(() =>
    this.#playoffGameService.divisionPlayoffGames()
  );
  hasPlayoffs = signal(false);
  divisionStandings = computed(() => this.#gameService.divisionStandings());
  hasStandings = signal(false);
  currentSeason = computed(() => this.seasonService.selectedSeason);
  seasonDescription = computed(
    () => this.seasonService.selectedSeason()?.description ?? ''
  );

  constructor() {
    effect(() => {
      // console.log(this.divisionPlayoffGames());
      if (this.divisionPlayoffGames() !== undefined) {
        this.hasPlayoffs.update(() => this.divisionPlayoffGames()!.length > 0);
      } else {
        this.hasPlayoffs.update(() => false);
      }
    });
    effect(() => {
      // console.log(this.divisionStandings());
      if (this.divisionStandings() !== undefined) {
        this.hasStandings.update(() => this.divisionStandings().length > 0);
      } else {
        this.hasStandings.update(() => false);
      }
    });
  }

  ngOnInit() {
    // Initialize display from current URL so downstream checks like
    // display() === 'schedule' behave correctly on first render.
    const url = this.router.url.toLowerCase();
    if (url.includes('/games/playoffs')) {
      this.display.set('playoffs');
    } else if (url.includes('/games/standings')) {
      this.display.set('standings');
    } else {
      this.display.set('schedule');
    }

    // Keep display in sync when user navigates via router links
    this.routeSub = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const next = evt.urlAfterRedirects.toLowerCase();
        if (next.includes('/games/playoffs')) {
          this.display.set('playoffs');
        } else if (next.includes('/games/standings')) {
          this.display.set('standings');
        } else {
          this.display.set('schedule');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onTabChanged(event: MatTabChangeEvent): void {
    console.log(event.tab.textLabel);
    switch (event.tab.textLabel) {
      case 'Schedule': // index of the tab
        // this is our stub tab for link
        this.display.update(() => 'schedule');
        this.router.navigate(['/games/schedule']);
        break;
      case 'Playoffs':
        this.display.update(() => 'playoffs');
        this.router.navigate(['/games/playoffs']);
        break;
      case 'Standings':
        this.display.update(() => 'standings');
        this.router.navigate(['/games/standings']);
        break;
    }
  }
}
