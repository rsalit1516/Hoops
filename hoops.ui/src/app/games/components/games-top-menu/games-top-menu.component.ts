import { Component, OnInit, Output, computed, effect, inject, input, output, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { Subject, Observable } from 'rxjs';
import { Division } from '@app/domain/division';
import { SeasonService } from '@app/services/season.service';
import { GameService } from '@app/services/game.service';
import { Season } from '@app/domain/season';
import { Team } from '@app/domain/team';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { GameFilterComponent } from '../game-filter/game-filter.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { PlayoffGameService } from '@app/services/playoff-game.service';

@Component({
  selector: 'csbc-games-top-menu',
  templateUrl: './games-top-menu.component.html',
  styleUrls: ['../../../shared/scss/select.scss',
    './games-top-menu.component.scss'
  ],
  imports: [CommonModule, RouterModule, RouterLinkActive,
    MatToolbarModule, MatTabsModule, GameFilterComponent]
})
export class GamesTopMenuComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store<fromGames.State>);

  divisions = input.required<Division[]>();
  teams = input.required<Team[]>();
  @Output() currentDivision: Division | undefined;
  display = signal<string>('schedule');
  readonly selectedDivision = output<Division>();
  private errorMessageSubject = new Subject<string>();
  readonly #seasonService = inject(SeasonService);
  readonly #gameService = inject(GameService);
  readonly #playoffGameService = inject(PlayoffGameService);
  filteredTeams!: Team[];
  selectedDivisionId$: Observable<number> | undefined;
  season: Season | undefined;
  divisionPlayoffGames = computed(() => this.#playoffGameService.divisionPlayoffGames());
  hasPlayoffs = signal(false);
  divisionStandings = computed(() => this.#gameService.divisionStandings());
  hasStandings = signal(false);
  currentSeason = computed(() => this.#seasonService.selectedSeason);
  seasonDescription = computed(() => this.#seasonService.selectedSeason.description);

  constructor () {
    effect(() => {
      console.log(this.divisionPlayoffGames());
      if (this.divisionPlayoffGames() !== undefined) {
        this.hasPlayoffs.update(() => this.divisionPlayoffGames()!.length > 0);
      } else {
        this.hasPlayoffs.update(() => false);
      }
    });
    effect(() => {
      console.log(this.divisionStandings());
      if (this.divisionStandings() !== undefined) {
        this.hasStandings.update(() => this.divisionStandings().length > 0);
      } else {
        this.hasStandings.update(() => false);
      }
    });
  }

  ngOnInit () { }

  onTabChanged (event: MatTabChangeEvent): void {
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
