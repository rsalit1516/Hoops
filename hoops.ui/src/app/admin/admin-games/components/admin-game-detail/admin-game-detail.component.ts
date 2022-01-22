import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../../state';
import * as adminActions from '../../../state/admin.actions';

@Component({
  selector: 'admin-game-detail',
  templateUrl: './admin-game-detail.component.html',
  styleUrls: ['./admin-game-detail.component.css', '../../../admin.component.scss'],
})
export class AdminGameDetailComponent implements OnInit {
  gameEditForm = this.fb.group({
    gameDate: [''],
    gameTime: [''],
    locationName: [''],
    visitorTeam: [''],
    homeTeam: [''],
  });
  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store.select(fromAdmin.getSelectedGame).subscribe((game) => {
      console.log(game);
      this.gameEditForm.patchValue({
        gameDate: game?.gameDate as Date,
        gameTime: game?.gameTime,
        locationName: game?.locationName,
        homeTeam: game?.homeTeamName,
        visitorTeam: game?.visitingTeamName,

      });
    });
  }
}
