import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { Season } from 'app/domain/season';
import * as adminActions from '../../state/admin.actions';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
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
  seasonComponent: UntypedFormControl | null | undefined;
  seasons: Season[] | undefined;
  selectedSeason: Season | undefined;
  selectedSeason$: Observable<Season> | undefined;
  defaultSeason: Season | undefined;
  selectForm = this.fb.group({
    seasonControl: new FormControl(''),
  });
  seasonControl = new UntypedFormControl('');

  constructor(
    private store: Store<fromAdmin.State>,
    private fb: UntypedFormBuilder
  ) {
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
  }

  ngOnInit() {
    // this.seasonComponent = this.selectForm.get('seasonControl') as FormControl;
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      console.log(season);
      this.selectedSeason = season as Season;
      this.seasonComponent?.setValue(this.selectedSeason);
    });
    this.seasonControl.valueChanges.subscribe((value) => {
      console.log(this.seasonControl.value);
      console.log(value);
      this.store.dispatch(new adminActions.SetSelectedSeason(value));
    });
  }
  setSelectedSeason(season: Season) {
    // console.log(season);
    // this.store.dispatch(new adminActions.SetSelectedSeason(season));
    // this.store.dispatch(new adminActions.SetSelectedSeasonId(season.seasonId));
  }
}
