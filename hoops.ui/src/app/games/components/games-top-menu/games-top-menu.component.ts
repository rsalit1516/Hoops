import { Component, OnInit, Output, input, output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { Subject, Observable } from 'rxjs';
import { Division } from '@app/domain/division';
import { SeasonService } from '@app/services/season.service';
import { GameService } from '@app/games/game.service';
import { Season } from '@app/domain/season';
import { Team } from '@app/domain/team';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { GameFilterComponent } from '../game-filter/game-filter.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

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
  readonly divisions = input.required<Division[]>();
  readonly teams = input.required<Team[]>();
  @Output() currentDivision: Division | undefined;
  readonly selectedDivision = output<Division>();
  private errorMessageSubject = new Subject<string>();
  filteredTeams!: Team[];
  seasonDescription: string | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  season: Season | undefined;
  hasPlayoffs = true;
  hasStandings = true;

  constructor(
    // private fb: FormBuilder,
    private store: Store<fromGames.State>,
    private gameService: GameService,
    private seasonService: SeasonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.select(fromGames.getCurrentSeason).subscribe((currentSeason) => {
      this.seasonDescription = currentSeason?.description;
    });
    this.store
      .select(fromGames.getDivisionPlayoffGames)
      .subscribe((playoffs) => {
        console.log('playoffs', playoffs);
        this.hasPlayoffs = playoffs.length > 0;
      });
    this.store.select(fromGames.getStandings).subscribe((standings) => {
      this.hasStandings = standings.length > 0;
    });
  }
  onTabChanged(event: MatTabChangeEvent): void {
    console.log(event.index);
    console.log(event.tab.textLabel);
    switch (event.tab.textLabel) {
      case 'Schedule': // index of the tab
        // this is our stub tab for link
        this.router.navigate(['/games/schedule']);
        break;
      case 'Playoffs':
        this.router.navigate(['/games/playoffs']);
        break;
      case 'Standings':
        this.router.navigate(['/games/standings']);
        break;
    }
  }
}
