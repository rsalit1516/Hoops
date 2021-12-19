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
import { Season } from '../../../../../../hoops.frontend/src/app/domain/season';

@Component({
  selector: 'csbc-games-top-menu',
  templateUrl: './games-top-menu.component.html',
  styleUrls: ['./games-top-menu.component.scss'],
})
export class GamesTopMenuComponent implements OnInit {
  @Input()
  divisions!: Division[];
  @Input() currentDivision: Division | undefined;
  menuForm!: FormGroup;
  @Output() selectedDivision = new EventEmitter<Division>();
  private errorMessageSubject = new Subject<string>();

  divisions$ = this.gameService.divisions$;
  // .pipe(
  //   tap(test => console.log(test)),
  //   catchError(err => {
  //     this.errorMessageSubject.next(err);
  //     return EMPTY;
  //   })
  // );
  // currentSeason$ = this.seasonService.currentSeason$.subscribe((season: { description: string; }) => this.seasonDescription = season.description);
  seasonDescription: string | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  season: Season | undefined;
  // firstDivision: Observable<Division> ;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromGames.State>,
    private gameService: GameService,
    private seasonService: SeasonService
  ) {
    const firstDivision = this.gameService.divisions$.pipe(take(1));
    firstDivision.subscribe((x) => {
      this.selectedDivision.emit(x[0]);
      console.log(x);
    });
  }

  ngOnInit() {
    this.store.select(fromGames.getCurrentSeason).subscribe((currentSeason) => {
      this.seasonDescription = currentSeason?.description;
    });
    this.createForm();
  }
  createForm() {
    this.menuForm = this.fb.group({
      divisions: this.divisions,
      teams: null,
      allTeams: true,
    });
  }
  divisionSelected(division: Division): void {
    console.log(division);
    this.selectedDivision.emit(division);
  }
}
