import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Standing } from '@app/domain/standing';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import { CommonModule } from '@angular/common';
import { StandingsComponent } from '@app/games/components/standings/standings.component';


@Component({
    selector: 'csbc-standings-shell',
    imports: [CommonModule, StandingsComponent],
    template: `<div class="container mx-auto">
  <div>
    <h1>Standings</h1>
    <csbc-standings [standings]="(standings$ | async) ?? []"></csbc-standings>
  </div>
</div>
`,
    styleUrls: ['./standings-shell.component.scss', '../../../../Content/styles.scss']
})
export class StandingsShellComponent implements OnInit {
  standings$: Observable<Standing[]>;
  currentSeason$: Observable<Season> | undefined;
  divisions$: Observable<Division[]> | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  errorMessage$: Observable<string> | undefined;
  selectedDivision$: Observable<any> | undefined;

  constructor(private store: Store<fromGames.State>) {
    this.standings$ = this.store.pipe(select(fromGames.getStandings));
  }

  ngOnInit() {
    this.setStateSubscriptions();
  }

  setStateSubscriptions() {
    console.log('ScheduleShell - set subscriptions');
    // this.standings$ = this.store.pipe(select(fromGames.getStandings));
  }

}
