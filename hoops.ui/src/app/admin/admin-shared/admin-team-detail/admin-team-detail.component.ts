import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';

@Component({
  selector: 'app-admin-team-detail',
  templateUrl: './admin-team-detail.component.html',
  styleUrls: [
    './admin-team-detail.component.scss',
    '../../admin.component.scss',
  ],
})
export class AdminTeamDetailComponent implements OnInit {
  teamEditForm = this.fb.group({
    teamName: [''],
    teamNo: [''],
    color: [''],
    coachName: [''],
    sponsor: [''],
  });

  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store.select(fromAdmin.getSelectedTeam).subscribe((team) => {
      console.log(team);

      this.teamEditForm.patchValue({
        teamName: team?.teamName,
        teamNo: team?.teamNumber,
        // locationName: game?.locationName,
        // homeTeam: this.homeTeam?.teamId,
        // visitorTeam: this.visitorTeam?.teamId,
      });
    });
  }
}
