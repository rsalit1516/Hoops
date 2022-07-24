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
  UntypedFormGroup,
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
  selectForm!: UntypedFormGroup;

  constructor(
    private store: Store<fromAdmin.State>,
    private fb: UntypedFormBuilder
  ) {
    this.selectForm = this.fb.group({
      seasonControl: new UntypedFormControl(''),
    });
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
  }

  ngOnInit() {
    this.seasonComponent = this.selectForm.get('seasonControl') as UntypedFormControl;
    this.seasonComponent?.valueChanges.subscribe((value) => {
      if (value !== this.selectedSeason) {
        this.store.dispatch(new adminActions.SetSelectedSeason(value));
      }
    });
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      if (season.seasonId !== undefined && season !== this.selectedSeason) {
        this.selectedSeason = season;
        this.seasonComponent?.setValue(season.seasonId);
      }
    });
  }
}
