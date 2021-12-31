import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { take, tap, first } from 'rxjs/operators';
import { Subject, EMPTY, Observable } from 'rxjs';
import { Division } from '@app/domain/division';
import { SeasonService } from '@app/services/season.service';
import { GameService } from '@app/games/game.service';
import { Season } from '@app/domain/season';
import { Team } from '@app/domain/team';

@Component({
  selector: 'csbc-games-top-menu',
  templateUrl: './games-top-menu.component.html',
  styleUrls: ['./games-top-menu.component.scss'],
})
export class GamesTopMenuComponent implements OnInit {
  @Input() divisions!: Division[];
  @Input() teams!: Team[];
  @Output() currentDivision: Division | undefined;
  @Output() selectedDivision = new EventEmitter<Division>();
  private errorMessageSubject = new Subject<string>();
  filteredTeams!: Team[];
  seasonDescription: string | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  season: Season | undefined;

  constructor(
    // private fb: FormBuilder,
    private store: Store<fromGames.State>,
    private gameService: GameService,
    private seasonService: SeasonService
  ) {}

  ngOnInit() {
    this.store.select(fromGames.getCurrentSeason).subscribe((currentSeason) => {
      this.seasonDescription = currentSeason?.description;
    });

  }
}
