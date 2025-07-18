import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDatepickerControl,
  MatDatepickerModule,
  MatDatepickerPanel,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SeasonService } from '@app/services/season.service';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Season } from '@app/domain/season';
import { Router, RouterModule } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'csbc-season-add',
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
    MatCheckboxModule,
  ],
  providers: [
    provideNativeDateAdapter(), ],
  templateUrl: './season-add-edit.component.html',
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class SeasonAddEditComponent implements OnInit {
  title = 'Season';
  readonly #seasonService = inject(SeasonService);
  private fb = inject(UntypedFormBuilder);
  readonly router = inject(Router);
  store = inject(Store<fromAdmin.State>);
  startDatePicker!: MatDatepickerPanel<MatDatepickerControl<any>, any, any>;

  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  form = this.fb.group({
    name: [ '', Validators.required ], //this.division.divisionDescription,
    seasonId: [ '' ], //this.division.seasonId,
    startDate: [ '' ],
    endDate: [ '' ],
    playerFee: [ '' ],
    sponsorFee: [ '' ],
    sponsorDiscount: [ '' ],
    signUpStartDate: [ '' ],
    signUpEndDate: [ '' ],
    // gameSchedules: [ '' ],
    currentSeason: [ '' ],
    currentSchedule: [ '' ],
    currentSignUps: [ '' ],
    onlineRegistration: [ '' ],
  });
  constructor() {
    effect(() => {
      if (this.selectedSeason()) {
        this.patchSeason();

      }
    });
  }
  ngOnInit(): void {
    console.log(this.selectedSeason());
    if (this.selectedSeason().seasonId !== undefined) {
      this.patchSeason();
    }
    else {
      this.form.patchValue({
        seasonId: 0,
      });

    }
  }
  patchSeason() {
    this.form.patchValue({
      name: this.selectedSeason().description,
      seasonId: this.selectedSeason().seasonId,
      startDate: this.selectedSeason().fromDate,
      endDate: this.selectedSeason().toDate,
      playerFee: this.selectedSeason().participationFee,
      sponsorFee: this.selectedSeason().sponsorFee,
      sponsorDiscount: this.selectedSeason().sponsorDiscount,
      signUpStartDate: this.selectedSeason().onlineStarts,
      signUpEndDate: this.selectedSeason().onlineStops,
      // gameSchedules: this.selectedSeason().gameSchedules,
      currentSeason: this.selectedSeason().currentSeason,
      currentSchedule: this.selectedSeason().currentSchedule,
      currentSignUps: this.selectedSeason().currentSignUps,
      onlineRegistration: this.selectedSeason().onlineRegistration,
    });

  }
  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted!', this.form.value);
      this.save(this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }
  save(value: any) {
    console.log(value);
    // convert to Season
    // this.seasonService.season = signal(new Season());
    let _season = new Season();
    _season.description = value.name;
    _season.seasonId = value.seasonId;
    _season.fromDate = value.startDate != undefined ? value.startDate : null;
    _season.toDate = value.endDate != undefined ? value.endDate : null;
    _season.participationFee = value.playerFee != undefined ? value.playerFee : 0;
    _season.sponsorFee = value.sponsorFee != undefined ? value.sponsorFee : 0;
    _season.sponsorDiscount = value.sponsorDiscount != undefined ? value.sponsorDiscount : 0;
    _season.onlineStarts = value.signUpStartDate != undefined ? value.signUpStartDate : null;
    _season.onlineStops = value.signUpEndDate != undefined ? value.signUpEndDate : null;
    // _season.gameSchedules = value.gameSchedules;
    _season.currentSeason = value.currentSeason;
    _season.onlineRegistration = value.onlineRegistration !== undefined ? value.onlineRegistration : false;
    this.#seasonService.season = signal(_season);
    console.log(_season);
    if (_season.seasonId === 0) {
      console.log('postSeason');
      this.#seasonService.postSeason(_season);
    } else {
      console.log('put Season');
      this.#seasonService.putSeason(_season);
    }
    this.#seasonService.seasonSaved.set(true);

    this.router.navigate(['/admin/seasons']);
  }

  cancel() {
    // this.#seasonService.seasonSaved.set(true);
    this.router.navigate(['/admin/season/list']);
  }
}
