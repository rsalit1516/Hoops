import { Component, OnInit, Input, input, inject, effect, computed, signal } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Season } from '../../domain/season';
import { Division } from '../../domain/division';
import { DivisionService } from '@app/services/division.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csbc-division-detail',
  templateUrl: './divisionDetail.component.html',
  styleUrls: ['../admin.component.scss'],
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule ],
})
export class DivisionDetailComponent implements OnInit {
  division = signal(new Division());
  // seasonForm: UntypedFormGroup;
  divisionForm: UntypedFormGroup;
  divisionService = inject(DivisionService);

  constructor(private fb: UntypedFormBuilder) {
    // effect(() => {
    //   this.division = this.divisionService.currentDivision;
    // })
    // // this.seasonForm = this.fb.group({
    //   // id: this.season.id,
    //   name: this.division.divisionDescription,
    //   maxDate: this.division.maxDate,
    //   minDate: this.division.minDate,
    //   seasonId: this.division.seasonId,
    // });
    this.divisionForm = this.fb.group({
      name: [ '', Validators.required ],  //this.division.divisionDescription,
      maxDate: [ '' ],  //this.division.maxDate,
      minDate: [ '' ],  //this.division.minDate,
      seasonId: [ '' ],  //this.division.seasonId,
      divisionId: [ '' ],  //this.division.seasonId,

    });
    effect(() => {
      console.log(this.divisionService.currentDivision());// this.division.update(this.divisionService.currentDivision);
      this.divisionForm.get('name')?.setValue(this.divisionService.currentDivision().divisionDescription);
      this.divisionForm.get('maxDate')?.setValue(this.divisionService.currentDivision().maxDate);
      this.divisionForm.get('minDate')?.setValue(this.divisionService.currentDivision().minDate);
    });

  }
  ngOnInit(): void {

  }

  save() { }

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
