import {
  Component,
  OnInit,
  Input,
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
import { CommonModule, formatDate } from '@angular/common';
import { LocationService } from '../../admin-shared/services/location.service';
import { MatCardModule } from '@angular/material/card';
import { Store, select } from '@ngrx/store';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

@Component({
  selector: 'csbc-division-detail',
  templateUrl: './divisionDetail.component.html',
  styleUrls: [
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DivisionService],
})
export class DivisionDetailComponent implements OnInit {
  selectedDivision = signal<Division>(new Division());
  private store = inject(Store<fromAdmin.State>);

  divisionForm: UntypedFormGroup;

  genders = [ 'M', 'F' ];
  minDateHint = 'Enter the min birthday - (mm//dd/yyyy)';
  maxDateHint = 'Enter the max birthday - (mm//dd/yyyy)';

  protected readonly divisionNameValue = signal('');
  dateFormat = 'MM/dd/yyyy';
  languageFormat = 'en';

  get division(){
      //this will do the trick
          return this.divisionService.getCurrentDivision();
        }
  set division(value) {
  }

  divisionService = inject(DivisionService);
  constructor(private fb: UntypedFormBuilder) {

    console.log(this.divisionService.getCurrentDivision());
    // this.division = this.divisionService.getCurrentDivision();
    this.divisionForm = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
      maxDate1: [ formatDate(this.division.maxDate, 'yyyy-MM-dd', 'en'), [ Validators.required ] ],
      //this.division.maxDate,
      minDate1: [formatDate(this.division.minDate, 'yyyy-MM-dd', 'en'), Validators.required], //this.division.minDate,
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
    console.log(this.divisionService.getCurrentDivision());
    this.division = this.divisionService.getCurrentDivision();
    console.log(this.division);
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      if (division !== null) {
        this.selectedDivision.update(() => division);
        console.log(division);
        this.divisionForm.get('name')?.setValue(division.divisionDescription);
        this.divisionForm.get('maxDate1')?.setValue(formatDate(division.maxDate,this.dateFormat, this.languageFormat));
        this.divisionForm.get('minDate1')?.setValue(formatDate(division.minDate, this.dateFormat, this.languageFormat));
        this.divisionForm.get('gender1')?.setValue(this.selectedDivision().gender);
        if (division.maxDate2 !== null) {
          this.divisionForm.get('maxDate2')?.setValue(formatDate(division.maxDate2, this.dateFormat, this.languageFormat));
        }
        // this.divisionForm.get('maxDate2')?.setValue(formatDate(division.maxDate2, this.dateFormat, this.languageFormat));
        if (division.minDate2 !== null) {
          this.divisionForm.get('minDate2')?.setValue(formatDate(division.minDate2, this.dateFormat, this.languageFormat));
        }
        if (division.maxDate2 !== null || division.minDate2 !== null) {
          this.divisionForm.get('gender2')?.setValue(this.selectedDivision().gender2);
        }
      }
    });
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
  protected onInputDivisionName(event: Event) {
    this.divisionNameValue.set((event.target as HTMLInputElement).value);
  }

}
