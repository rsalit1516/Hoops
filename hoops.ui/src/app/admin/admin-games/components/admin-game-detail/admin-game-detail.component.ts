import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Team } from '@app/domain/team';
import { select, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as fromAdmin from '../../../state';
import * as adminActions from '../../../state/admin.actions';

@Component({
  selector: 'admin-game-detail',
  templateUrl: './admin-game-detail.component.html',
  styleUrls: [
    './admin-game-detail.component.scss',
    '../../../admin.component.scss',
  ],
})
export class AdminGameDetailComponent implements OnInit {
  gameEditForm = this.fb.group({
    gameDate: [''],
    gameTime: [''],
    locationName: [''],
    visitorTeam: [''],
    homeTeam: [''],
  });
  visitorTeam!: Team | undefined;
  homeTeam: Team | undefined;
  divisionTeams$: Observable<Team[]>;
  visitorComponent: FormControl | null | undefined;

  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {
    this.divisionTeams$ = this.store.select(fromAdmin.getDivisionTeams);
  }

  ngOnInit(): void {
    this.visitorComponent = this.gameEditForm.get('visitorTeam') as FormControl;
    this.store.select(fromAdmin.getSelectedGame).subscribe((game) => {
      console.log(game);
      this.getTeam(game?.homeTeamId as number).subscribe(team => {
        console.log(team);
        this.homeTeam = team;
      });
      console.log(this.homeTeam);
      this.getTeam(game?.visitingTeamId as number).subscribe(team => {
        console.log(team);
        this.visitorTeam = team;
      });
      console.log(this.visitorTeam);

      this.gameEditForm.patchValue({
        gameDate: game?.gameDate as Date,
        gameTime: game?.gameTime,
        locationName: game?.locationName,
        homeTeam: this.homeTeam?.teamId,
        visitorTeam: this.visitorTeam?.teamId,
      });
      // this.visitorComponent?.setValue(this.visitorTeam);
    });
  }
  getTeam(teamId: number) {
    return this.divisionTeams$.pipe(
      map((t) => t.find((s) => s.teamId === teamId))
    );
  }
}
