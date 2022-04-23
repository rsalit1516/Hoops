import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { Season } from 'app/domain/season';
import * as adminActions from '../../state/admin.actions';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';

@Component({
  selector: 'season-select',
  templateUrl: './season-select.component.html',
  styleUrls: ['./season-select.component.scss', '../../admin.component.scss'],
})
export class SeasonSelectComponent implements OnInit {
  seasons$!: Observable<Season[]>;
  // selectForm!: FormGroup;
  selected: Season | undefined;
  seasonComponent: FormControl | null | undefined;
  seasons: Season[] | undefined;
  selectedSeason: Season | undefined;
  defaultSeason: Season | undefined;
  selectForm = this.fb.group({
    seasonControl: new FormControl(),
  });

  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
  }

  ngOnInit() {
    this.seasonComponent = this.selectForm.get('seasonControl') as FormControl;

    // this.seasonComponent?.valueChanges.subscribe((value) => {
    //   console.log(this.seasonComponent?.value);
    //   console.log(value);
    //   this.store.dispatch(new adminActions.SetSelectedSeason(value));
    // });

    this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
      console.log(season);
      this.selectedSeason = season;
      this.seasonComponent?.setValue(this.selectedSeason);
    });
  }
  setSelectedSeason(season: Season) {
    console.log(season);
    this.store.dispatch(new adminActions.SetSelectedSeason(season));
    this.store.dispatch(new adminActions.SetSelectedSeasonId(season.seasonId));
  }
}
