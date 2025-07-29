import { Component, inject, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Standing } from '@app/domain/standing';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import { CommonModule } from '@angular/common';
import { StandingsComponent } from '@app/games/components/standings/standings.component';
import { GameService } from '@app/services/game.service';


@Component({
  selector: 'csbc-standings-shell',
  imports: [ CommonModule, StandingsComponent ],
  template: `<div class="container mx-auto">
  <div>
    <h1>{{title}}</h1>
    <csbc-standings [standings]="divisionStandings() ?? []"></csbc-standings>
  </div>
</div>
`,
  styleUrls: [
    './standings-shell.component.scss',
    '../../../shared/scss/tables.scss',
    '../../../../Content/styles.scss' ]
})
export class StandingsShellComponent {
  private gameService = inject(GameService);

  title = 'Standings';
  divisionStandings = this.gameService.divisionStandings;

}
