import { Component, OnInit } from '@angular/core';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { TeamService } from '../../admin-shared/services/team.service';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

@Component({
  selector: 'season-setup',
  templateUrl: './season-setup.component.html',
  styleUrls: ['./season-setup.component.scss', '../../admin.component.scss']
})
export class SeasonSetupComponent implements OnInit {

  constructor(private teamService: TeamService, private store: Store<fromAdmin.State>) { }

  ngOnInit() {
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      console.log(division);
      if (division !== undefined) {
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });
  }
  newTeam(): Team {
    return this.teamService.newTeam();
  }
}
