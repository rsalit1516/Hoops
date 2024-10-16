import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerControl, MatDatepickerModule, MatDatepickerPanel } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SeasonService } from '@app/services/season.service';

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
  ],
  providers: [SeasonService],
  templateUrl: './season-add.component.html',
  styleUrls: [ '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    './season-add.component.scss'
  ]
})
export class SeasonAddComponent {
  title = 'Season';
  seasonService  = inject(SeasonService);
  form: any;
startDatePicker!: MatDatepickerPanel<MatDatepickerControl<any>, any, any> ;
  constructor (private fb: UntypedFormBuilder) {

    this.form = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
      seasonId: [''], //this.division.seasonId,
      divisionId: [ '' ], //this.division.seasonId,
      startDate: [ '' ],
      endDate: [ '' ],
      playerFee: [ '' ],
      sponsorFee: [ '' ],
      sponsorDiscount: [ '' ],
      onlineStart: [ '' ],
      onlineEnd: [ '' ],
      gameSchedules: [ '' ],
      currentSeason: [ '' ],
      onLineRegistration: [ '' ],
    }); }
  save() { }
  cancel() { }
  new() {}
}
