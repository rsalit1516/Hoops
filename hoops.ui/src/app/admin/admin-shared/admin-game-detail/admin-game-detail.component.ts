import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Team } from '@app/domain/team';
import { select, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'admin-game-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './admin-game-detail.component.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/forms.scss',
    '../../admin.component.scss',],
})
export class AdminGameDetailComponent implements OnInit {
  gameEditForm = this.fb.group({
    gameDate: new FormControl('', { nonNullable: true }),
    gameTime: new FormControl('', { nonNullable: true }),
    locationName: new FormControl('', { nonNullable: false }),
    visitorTeam: new FormControl('', { nonNullable: true }),
    homeTeam: new FormControl('', { nonNullable: true }),
  });
  visitorTeam!: Team | undefined;
  homeTeam: Team | undefined;
  divisionTeams$: Observable<Team[]>;
  visitorComponent: UntypedFormControl | null | undefined;
  gameTimeFormatted: string | undefined;

  constructor(
    private store: Store<fromAdmin.State>,
    private fb: UntypedFormBuilder
  ) {
    this.divisionTeams$ = this.store.select(fromAdmin.getDivisionTeams);
  }

  ngOnInit(): void {
    this.visitorComponent = this.gameEditForm.get(
      'visitorTeam'
    ) as UntypedFormControl;
    this.store.select(fromAdmin.getSelectedGame).subscribe((game) => {
      console.log(game);
      // const gametime = new Date(game.gameTime);
      this.gameTimeFormatted =
        game?.gameTime?.getHours + ':' + game?.gameTime?.getMinutes;
      console.log(this.gameTimeFormatted);
      this.getTeam(game?.homeTeamId as number).subscribe((team) => {
        // console.log(team);
        this.homeTeam = team;
      });
      console.log(this.homeTeam);
      this.getTeam(game?.visitingTeamId as number).subscribe((team) => {
        // console.log(team);
        this.visitorTeam = team;
      });
      // console.log(this.visitorTeam);

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

  save() {}
}
