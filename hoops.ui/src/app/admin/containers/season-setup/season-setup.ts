import { Component, inject, OnInit } from '@angular/core';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { TeamService } from '@app/services/team.service';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { AdminTeamDetail } from '../../admin-shared/admin-team-detail/admin-team-detail';
import { AdminTeamList } from '../../admin-shared/admin-team-list/admin-team-list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DivisionSelect } from '../../admin-shared/division-select/division-select';
import { SeasonSelect } from '../../admin-shared/season-select/season-select';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'season-setup',
  templateUrl: "./season-setup.html",
  styleUrls: ['./season-setup.scss', '../../admin.scss'],
  imports: [SeasonSelect, DivisionSelect, MatToolbarModule, MatButtonModule, AdminTeamList, AdminTeamDetail]
})
export class SeasonSetup implements OnInit {

  readonly teamService = inject(TeamService);
  readonly #divisionService = inject(DivisionService);
  readonly store = inject(Store<fromAdmin.State>);

  constructor () { }

  ngOnInit () {
    //    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
    this.teamService.updateAllTeams(false);
    const division = this.#divisionService.selectedDivision; // Use the division service to get the selected division
    // console.log(division);
    //   if (division !== undefined) {
    //     this.store.dispatch(new adminActions.LoadDivisionTeams());
    //   }
    // });
  }
  newTeam (): Team {
    return this.teamService.newTeam();
  }
}
