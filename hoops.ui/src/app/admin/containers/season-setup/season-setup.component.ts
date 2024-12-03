import { Component, OnInit } from '@angular/core';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { TeamService } from '../../admin-shared/services/team.service';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { AdminTeamDetailComponent } from '../../admin-shared/admin-team-detail/admin-team-detail.component';
import { AdminTeamListComponent } from '../../admin-shared/admin-team-list/admin-team-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DivisionSelectComponent } from '../../admin-shared/division-select/division-select.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';

@Component({
    selector: 'season-setup',
    templateUrl: './season-setup.component.html',
    styleUrls: ['./season-setup.component.scss', '../../admin.component.scss'],
    imports: [SeasonSelectComponent, DivisionSelectComponent, MatToolbarModule, MatButtonModule, AdminTeamListComponent, AdminTeamDetailComponent]
})
export class SeasonSetupComponent implements OnInit {

  constructor(private teamService: TeamService, private store: Store<fromAdmin.State>) { }

  ngOnInit() {
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      // console.log(division);
      if (division !== undefined) {
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });
  }
  newTeam(): Team {
    return this.teamService.newTeam();
  }
}
