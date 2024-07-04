import {
  Component,
  OnInit,
  Input,
  input,
  inject,
  effect,
  computed,
  signal,
  model,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Season } from '../../../domain/season';
import { Division } from '../../../domain/division';
import { DivisionService } from '@app/services/division.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../admin-shared/services/location.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'csbc-division-detail',
  templateUrl: './divisionDetail.component.html',
  styleUrls: [ '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
  '../../../shared/scss/cards.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DivisionDetailComponent implements OnInit {
  selectedDivision = input<Division>();
  // division = input<Division>();

  // seasonForm: UntypedFormGroup;
  divisionForm: UntypedFormGroup;
  divisionService = inject(DivisionService);
  locationService = inject(LocationService);
  test = this.divisionService.currentDivision();
  locations = this.locationService.locations();
  genders = [ 'male', 'female' ];
  constructor(
    private fb: UntypedFormBuilder,
    ) {
    console.log(this.divisionService.currentDivision());
    effect(() => {
      console.log(this.divisionService.currentDivision());
    });
    // effect(() => {
    //   console.log(this.test); // = this.divisionService.currentDivision;
    //  })
    // // this.seasonForm = this.fb.group({
    //   // id: this.season.id,
    //   name: this.division.divisionDescription,
    //   maxDate: this.division.maxDate,
    //   minDate: this.division.minDate,
    //   seasonId: this.division.seasonId,
    // });
    this.divisionForm = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
      maxDate1: ['', Validators.required], //this.division.maxDate,
      minDate1: ['', Validators.required], //this.division.minDate,
      gender1: [''],
      maxDate2: [''], //this.division.maxDate,
      minDate2: [''], //this.division.minDate,
      gender2: [''],
      director: [''],
      seasonId: [''], //this.division.seasonId,
      divisionId: [''], //this.division.seasonId,
    });
    // effect(() => {
    //   console.log(this.divisionService.currentDivision());// this.division.update(this.divisionService.currentDivision);
    //   //this.divisionForm.get('name')?.setValue(this.divisionService.currentDivision().divisionDescription);
    //   //this.divisionForm.get('maxDate')?.setValue(this.divisionService.currentDivision().maxDate);
    //   //this.divisionForm.get('minDate')?.setValue(this.divisionService.currentDivision().minDate);
    // });
  }
  ngOnInit(): void {
    console.log(this.divisionService.currentDivision());
    console.log(this.test);
    console.log(this.selectedDivision());
    console.log(this.locations);
  }
  save() {}

  updateErrorMessage() {
    // if (this.email.hasError('required')) {
    //   this.errorMessage = 'You must enter a value';
    // } else if (this.email.hasError('email')) {
    //   this.errorMessage = 'Not a valid email';
    // } else {
    //   this.errorMessage = '';
    // }
  }
}
