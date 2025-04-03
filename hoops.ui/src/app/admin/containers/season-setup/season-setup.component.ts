import { Component, inject, OnInit } from '@angular/core';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { TeamService } from '@app/services/team.service';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { AdminTeamDetailComponent } from '../../admin-shared/admin-team-detail/admin-team-detail.component';
import { AdminTeamListComponent } from '../../admin-shared/admin-team-list/admin-team-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DivisionSelectComponent } from '../../admin-shared/division-select/division-select.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'season-setup',
  templateUrl: './season-setup.component.html',
  styleUrls: ['./season-setup.component.scss', '../../admin.component.scss'],
  imports: [SeasonSelectComponent, DivisionSelectComponent, MatToolbarModule, MatButtonModule, AdminTeamListComponent, AdminTeamDetailComponent]
})
export class SeasonSetupComponent implements OnInit {

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
