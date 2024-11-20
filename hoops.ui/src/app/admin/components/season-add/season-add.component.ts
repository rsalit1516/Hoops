import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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

@Component({
    selector: 'app-season-add',
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
    providers: [SeasonService],
    templateUrl: './season-add.component.html',
    styleUrls: [
        '../../../shared/scss/forms.scss',
        '../../../shared/scss/cards.scss',
        './season-add.component.scss',
    ]
})
export class SeasonAddComponent implements OnInit {
  title = 'Season';
  seasonService = inject(SeasonService);
  form: any;
  startDatePicker!: MatDatepickerPanel<MatDatepickerControl<any>, any, any>;
  store = inject(Store<fromAdmin.State>);

  constructor(private fb: UntypedFormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
      seasonId: [''], //this.division.seasonId,
      startDate: [''],
      endDate: [''],
      playerFee: [''],
      sponsorFee: [''],
      sponsorDiscount: [''],
      signUpStartDate: [''],
      signUpEndDate: [''],
      gameSchedules: [''],
      currentSeason: [''],
      currentSchedule: [''],
      currentSignUps: [''],
      onlineRegistration: [''],
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
          onlineRegistration: season.onlineRegistration,
        });
      } else {
        this.form.patchValue({
          seasonId: 0,
        });
      }
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
    _season.fromDate = value.startDate;
    _season.toDate = value.endDate;
    _season.participationFee = value.playerFee;
    _season.sponsorFee = value.sponsorFee;
    _season.sponsorDiscount = value.sponsorDiscount;
    _season.onlineStarts = value.signUpStartDate;
    _season.onlineStops = value.signUpEndDate;
    _season.gameSchedules = value.gameSchedules;
    _season.currentSeason = value.currentSeason;
    _season.onlineRegistration = value.onlineRegistration;
    this.seasonService.season = signal(_season);
    console.log(_season);
    if (_season.seasonId === 0) {
      console.log('postSeason');
      this.seasonService.postSeason(_season);
    } else {
      console.log('put Season');
      this.seasonService.putSeason(_season);
    }

    this.router.navigate(['/admin/seasons']);
  }

  cancel() {
    this.router.navigate(['/admin/seasons']);
  }
}
