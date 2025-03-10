import { Component, inject, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import * as adminActions from '../../state/admin.actions';
import { UntypedFormControl, FormsModule } from '@angular/forms';
import { AdminSeasonService } from '../services/season.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'season-select',
  templateUrl: './season-select.component.html',
  styleUrls: ['./../../../shared/scss/select.scss',
    './../../../shared/scss/forms.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    AsyncPipe,
  ]
})
export class SeasonSelectComponent implements OnInit {
  #seasonService = inject(AdminSeasonService);
  seasons$!: Observable<Season[]>;
  // selectForm!: FormGroup;
  selected: Season | undefined;
  seasonComponent: UntypedFormControl | null | undefined;
  seasons: Season[] | undefined;
  selectedSeason: number | null = null;
  // selectedSeason$: Observable<Season> | undefined;
  defaultSeason: Season | undefined;
  // selectForm!: UntypedFormGroup;
  selectedValue: number | undefined;
  

  @Output() seasonChanged = new EventEmitter<Season>();

  constructor (
    private store: Store<fromAdmin.State>
  ) {
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
  }

  ngOnInit () {
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      if (season.seasonId !== undefined && season.seasonId !== this.selectedSeason) {
        this.#seasonService.updateSelectedSeason(season);
        this.selectedSeason = season.seasonId;
      }
    });
  }
  changeSeason (season: Season) {
    console.log('Season from changeSeason = ', season);
    this.#seasonService.updateSelectedSeason(season);
    this.store.dispatch(new adminActions.SetSelectedSeason(season));
  }
  onChange (value: Season) {
    this.selectedSeason = value.seasonId!;
    this.changeSeason(value);
    console.log('Season from onChange = ', value);
    this.seasonChanged.emit(value); // Emit the selected
    //  season
  }

}
