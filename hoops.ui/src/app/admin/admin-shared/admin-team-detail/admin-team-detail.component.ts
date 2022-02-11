import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Color } from '@app/domain/color';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAdmin from '../../state';
import { TeamService } from './../services/team.service';

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

  constructor(
    private store: Store<fromAdmin.State>,
    private fb: FormBuilder,
    private teamService: TeamService
  ) {
    this.colors$ = this.store.select(fromAdmin.getColors);
  }

  ngOnInit(): void {
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
    return (this.editTeamForm = this.fb.group({
      teamName: [''],
      teamNo: [''],
      color: [''],
    }));
  }
  save() {
    let team: Team;
    team = {
      teamId: 0,
      name: '',
      divisionId: 9900,
      teamNumber: this.editTeamForm.value.teamNo,
      teamColorId: this.editTeamForm.value.color.teamColorId,
    };
    this.teamService.saveTeam(team);
  }
  cancel() {}
}
