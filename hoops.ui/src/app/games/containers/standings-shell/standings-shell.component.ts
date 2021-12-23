import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Standing } from 'app/domain/standing';
import { Season } from 'app/domain/season';
import { Division } from 'app/domain/division';
import { Team } from 'app/domain/team';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';


@Component({
  selector: 'csbc-standings-shell',
  templateUrl: './standings-shell.component.html',
  styleUrls: ['./standings-shell.component.scss']
})
export class StandingsShellComponent implements OnInit {
  standings$:  Observable<Standing[]> | undefined;
  currentSeason$: Observable<Season> | undefined;
  divisions$: Observable<Division[]> | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  errorMessage$: Observable<string> | undefined;
  selectedDivision$: Observable<any> | undefined;
  
  constructor( private store: Store<fromGames.State>) { }

  ngOnInit() {
    this.setStateSubscriptions();
  }

  setStateSubscriptions() {
    console.log('ScheduleShell - set subscriptions');
    this.standings$ = this.store.pipe(select(fromGames.getStandings));
  }
  // divisionSelected(division: Division): void {
  //   this.store.dispatch(new gameActions.SetCurrentDivision(division));
  //   console.log(division);
  //   this.store.dispatch(new gameActions.LoadStandings());
  // }

}
