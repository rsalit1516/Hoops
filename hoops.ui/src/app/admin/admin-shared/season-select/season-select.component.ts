import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import * as adminActions from '../../state/admin.actions';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';
import { SeasonService } from '../services/season.service';
import { AsyncPipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'season-select',
    templateUrl: './season-select.component.html',
    styleUrls: ['./../../../shared/scss/select.scss'],
    standalone: true,
    imports: [
        FormsModule,
        // ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        AsyncPipe,
    ],
})
export class SeasonSelectComponent implements OnInit {
  seasons$!: Observable<Season[]>;
  // selectForm!: FormGroup;
  selected: Season | undefined;
  seasonComponent: UntypedFormControl | null | undefined;
  seasons: Season[] | undefined;
  selectedSeason: Season | undefined;
  // selectedSeason$: Observable<Season> | undefined;
  defaultSeason: Season | undefined;
  // selectForm!: UntypedFormGroup;
  selectedValue: number | undefined;

  constructor(
    private store: Store<fromAdmin.State>,
    // private fb: UntypedFormBuilder,
    private seasonService: SeasonService
  ) {
    // this.selectForm = this.fb.group({
    //   seasonControl: new UntypedFormControl(''),
    // });
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
  }

  ngOnInit() {
//     this.seasonComponent = this.selectForm.get('seasonControl') as UntypedFormControl;
    // this.seasonComponent?.valueChanges.subscribe((value) => {
    //   console.log(value);
    //   let selectedSeason = new Season();
    //   if (value !== 0) {
    //     selectedSeason = this.seasonService.getSeason(value);
    //   }
    //   console.log(selectedSeason);
    //   this.store.dispatch(new adminActions.SetSelectedSeason(selectedSeason));
    // });
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      console.log(season);
      if (season.seasonId !== undefined && season !== this.selectedSeason) {
        // this.selectedSeason = season;
        // this.seasonComponent?.setValue(season.seasonId);
        this.selectedValue = season.seasonId;
      }
    });
  }
  changeSeason(season: Season) {
    this.store.dispatch(new adminActions.SetSelectedSeason(season));
  }
}
