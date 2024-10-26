import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerControl, MatDatepickerModule, MatDatepickerPanel } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SeasonService } from '@app/services/season.service';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Season } from '@app/domain/season';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-season-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [SeasonService],
  templateUrl: './season-add.component.html',
  styleUrls: [ '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    './season-add.component.scss'
  ]
})
export class SeasonAddComponent implements OnInit{
  title = 'Season';
  seasonService  = inject(SeasonService);
  form: any;
  startDatePicker!: MatDatepickerPanel<MatDatepickerControl<any>, any, any>;
  store = inject(Store<fromAdmin.State>);

  constructor (private fb: UntypedFormBuilder) {

    this.form = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
      seasonId: [''], //this.division.seasonId,
      startDate: [ '' ],
      endDate: [ '' ],
      playerFee: [ '' ],
      sponsorFee: [ '' ],
      sponsorDiscount: [ '' ],
      signUpStartDate: [ '' ],
      signUpEndDate: [ '' ],
      gameSchedules: [ '' ],
      currentSeason: [ '' ],
      currentSchedule: [ '' ],
      currentSignUps: [ '' ],
      onlineRegistration: [ '' ],
    });
  }
  ngOnInit(): void {
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      console.log(season);
      if (season.seasonId !== undefined) {
        this.form.patchValue({
          name: season.description,
          seasonId: season.seasonId,
          startDate: season.fromDate,
          endDate: season.toDate,
          playerFee: season.participationFee,
          sponsorFee: season.sponsorFee,
          sponsorDiscount: season.sponsorDiscount,
          signUpStartDate: season.onlineStarts,
          signUpEndDate: season.onlineStops,
          gameSchedules: season.gameSchedules,
          currentSeason: season.currentSeason,
          currentSchedule: season.currentSchedule,
          currentSignUps: season.currentSignUps,
          onlineRegistration: season.onlineRegistration
        });
      };
    });
  }

  save () {
    console.log(this.form.value);
    // convert to Season
    // this.seasonService.season = signal(new Season());
    let _season = new Season();
    _season.description = this.form.value.name;
    _season.seasonId = this.form.value.seasonId;
    _season.fromDate = this.form.value.startDate;
    _season.toDate = this.form.value.endDate;
    _season.participationFee = this.form.value.playerFee;
    _season.sponsorFee = this.form.value.sponsorFee;
    _season.sponsorDiscount = this.form.value.sponsorDiscount;
    _season.onlineStarts = this.form.value.signUpStartDate;
    _season.onlineStops = this.form.value.signUpEndDate;
    _season.gameSchedules = this.form.value.gameSchedules;
    _season.currentSeason = this.form.value.currentSeason;
    _season.onlineRegistration = this.form.value.onlineRegistration;
    this.seasonService.season = signal(_season);

    if (_season.seasonId !== undefined) {
      this.seasonService.postSeason(_season);
    } else {
      this.seasonService.patchSeason(_season);
    }
  }
  cancel() { }
  new() {}
}
