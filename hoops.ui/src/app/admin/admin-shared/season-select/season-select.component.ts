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
  selectForm!: FormGroup;
  selected: Season | undefined;
  seasonComponent: FormControl | null | undefined;

  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {
    this.selectForm = this.fb.group({
      season: new FormControl(''),
    });
  }

  ngOnInit() {
    this.seasonComponent = this.selectForm.get('season') as FormControl;
    this.seasons$ = this.store.pipe(select(fromAdmin.getSeasons));
    this.store.pipe(select(fromAdmin.getCurrentSeason)).subscribe((season) => {
      console.log(season);
      this.seasonComponent?.setValue(season);
    });
    this.seasonComponent?.valueChanges.subscribe((value) => {
      console.log(value);
      this.store.dispatch(new adminActions.SetSelectedSeason(value));
      // this.store.dispatch(new adminActions.SetSelectedSeasonId(value.seasonId));
    });
    this.seasons$.subscribe((seasons) => {
      if (seasons === undefined) {
        this.selected = seasons[0];
        this.selectedSeason(this.selected);
      }
    });
  }
  selectedSeason(season: Season) {
    console.log(season);
    // this.store.dispatch(new adminActions.SetSelectedSeason(season));
    // this.store.dispatch(new adminActions.SetSelectedSeasonId(season.seasonId));
  }
}
