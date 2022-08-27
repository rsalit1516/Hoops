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
import { SeasonService } from '../services/season.service';

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
    private fb: UntypedFormBuilder,
    private seasonService: SeasonService
  ) {
    this.selectForm = this.fb.group({
      seasonControl: new UntypedFormControl(''),
    });
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
  }

  ngOnInit() {
    this.seasonComponent = this.selectForm.get('seasonControl') as UntypedFormControl;
    this.seasonComponent?.valueChanges.subscribe((value) => {
      const selectedSeason = this.seasonService.getSeason(value);
      this.store.dispatch(new adminActions.SetSelectedSeason(selectedSeason));
    });
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      if (season.seasonId !== undefined && season !== this.selectedSeason) {
        this.selectedSeason = season;
        this.seasonComponent?.setValue(season.seasonId);
      }
    });
  }
}
