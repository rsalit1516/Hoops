import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Division } from 'app/domain/division';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { catchError, tap } from 'rxjs/operators';
import { Subject, EMPTY, Observable } from 'rxjs';
import { GameService } from 'app/games/game.service';
import { SeasonService } from 'app/services/season.service';

@Component({
  selector: 'csbc-games-top-menu',
  templateUrl: './games-top-menu.component.html',
  styleUrls: ['./games-top-menu.component.scss']
})
export class GamesTopMenuComponent implements OnInit {
  @Input() divisions: Division[];
  @Input() currentDivision: Division;
  menuForm: FormGroup;
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
  currentSeason$ = this.seasonService.currentSeason$.subscribe(season => this.seasonDescription = season.description);
  seasonDescription: string;
  selectedDivisionId$: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromGames.State>,
    private gameService: GameService,
    private seasonService: SeasonService
  ) {}

  ngOnInit() {
    this.setStateSubscriptions();
    this.createForm();
    this.setControlSubscriptions();
    //    const toSelect = this.patientCategories.find(c => c.id == 3);
    //      this.patientCategory.get('patientCategory').setValue(toSelect);
  }
  createForm() {
    this.menuForm = this.fb.group({
      divisions: this.divisions,
      teams: null,
      allTeams: true
    });
  }
  setControlSubscriptions() {
    this.menuForm.get('divisions').valueChanges.subscribe(val => {
      console.log(val);
      // this.store.dispatch(new gameActions.SetCurrentDivision(val));
    });
  }
  setStateSubscriptions() {

  }
  divisionSelected(division: Division): void {
    console.log(division);
    this.selectedDivision.emit(division);
  }
}
