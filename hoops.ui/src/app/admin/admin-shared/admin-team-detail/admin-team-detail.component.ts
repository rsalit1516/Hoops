import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Color } from '@app/domain/color';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

import * as fromUser from '../../../user/state';
import { TeamService } from './../services/team.service';
import { User } from '@app/domain/user';

@Component({
  selector: 'app-admin-team-detail',
  templateUrl: './admin-team-detail.component.html',
  styleUrls: [
    './admin-team-detail.component.scss',
    '../../admin.component.scss',
  ],
})
export class AdminTeamDetailComponent implements OnInit {
  editTeamForm = this.fb.group({
    // teamName: [''],
    teamNo: [''],
    color: [''],
    // coachName: [''],
    // sponsor: [''],
  });
  colors$: Observable<Color[]>;
  team: Team | undefined;
  selectedDivision$ = this.store.select(fromAdmin.getSelectedDivision);
  selectedSeason$ = this.store.select(fromAdmin.getSelectedSeason);
  selectedDivision: Division | null | undefined;
  user!: User;
  title = 'Team';

  constructor(
    private store: Store<fromAdmin.State>,
    private userStore: Store<fromUser.State>,
    private fb: UntypedFormBuilder,
    private teamService: TeamService
  ) {
    this.colors$ = this.store.select(fromAdmin.getColors);
    this.store
      .select(fromUser.getCurrentUser)
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.selectedDivision$.subscribe(
      (division) => (this.selectedDivision = division)
    );
    this.store.select(fromAdmin.getSelectedTeam).subscribe((team) => {
      console.log(team);
      this.team = team as Team;
      this.editTeamForm.patchValue({
        // teamName: team?.teamName,
        teamNo: team?.teamNumber,
        color: team?.teamColorId,
        // locationName: game?.locationName,
        // homeTeam: this.homeTeam?.teamId,
        // visitorTeam: this.visitorTeam?.teamId,
      });
    });
  }
  newTeam() {
    this.editTeamForm = this.fb.group({
      teamName: [''],
      teamNo: [''],
      color: [''],
    });
let newTeam  = new Team();

    newTeam.teamId = 0;
    newTeam.teamName = '';
    this.store.dispatch(new adminActions.SetSelectedTeam(newTeam));

}
  save() {
    let team: Team;
    console.log(this.team)
;    team = {
      teamId: this.team?.teamId as number,
      name: '',
      divisionId: this.selectedDivision?.divisionId as number,
      teamNumber: this.editTeamForm.value.teamNo,
      teamColorId: this.editTeamForm.value.color,
      createdUser: this.user.userName,
      createdDate: new Date()
    };
    this.teamService.saveTeam(team);
    this.newTeam();
  }
  cancel() {}
}
