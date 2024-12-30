import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Division } from '../../../domain/division';
import { DivisionService } from '@app/services/division.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';
import { NewDivisionSelectorComponent } from '@app/admin/admin-shared/new-division-selector/new-division-selector.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ConfirmDialogComponent } from '@app/admin/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';
import { PeopleService } from '@app/services/people.service';

@Component({
  selector: 'csbc-division-detail',
  templateUrl: './divisionDetail.component.html',
  styleUrls: [
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    NewDivisionSelectorComponent,
    ConfirmDialogComponent,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DivisionService, PeopleService],
})
export class DivisionDetailComponent implements OnInit {
  store = inject(Store<fromAdmin.State>);
  dialog = inject(MatDialog);
  divisionService = inject(DivisionService);
  peopleService = inject(PeopleService);

  selectedDivision = signal<Division>(new Division());
  selectedDivisionDescription: string = ''; // = signal<Division>(new Division());
  division = signal<Division>(new Division());
  ads = toSignal(this.peopleService.getADPeople());

  nameControl = new FormControl('', Validators.required);

  divisionForm = this.fb.group({
    //this.division.divisionDescription,
    name: [''],
    maxDate1: [
      this.division() && this.division().maxDate
        ? formatDate(this.division().maxDate, 'yyyy-MM-dd', 'en')
        : '',
      [Validators.required],
    ],
    //this.division.maxDate,
    minDate1: [
      this.division() && this.division().minDate
        ? formatDate(this.division().minDate, 'yyyy-MM-dd', 'en')
        : '',
      Validators.required,
    ], //this.division.minDate,
    gender1: [''],
    maxDate2: [''], //this.division.maxDate,
    minDate2: [''], //this.division.minDate,
    gender2: [''],
    director: [''],
    seasonId: [''], //this.division.seasonId,
    divisionId: [''], //this.division.seasonId,
  });

  genders = ['M', 'F'];
  minDateHint = 'Min date: mm//dd/yyyy';
  maxDateHint = 'Max date: mm//dd/yyyy';

  newDivision = signal<Division>(new Division());
  hideNameInput = signal<boolean>(true);

  protected readonly divisionNameValue = signal('');
  dateFormat = 'MM/dd/yyyy';
  languageFormat = 'en';
  hideName = false;

  selectedItem: string = '';

  selectItem(item: string) {
    this.selectedItem = item;
  }
  constructor(private fb: FormBuilder) {
    console.log(this.divisionService.currentDivision());
    // this.division = this.divisionService.getCurrentDivision();
  }
  ngOnInit(): void {
    console.log(this.divisionService.currentDivision());
    this.division.set(this.divisionService.currentDivision()!);
    console.log(this.division);
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      if (division !== null) {
        if (division?.divisionDescription !== undefined) {
          const matchingDivision = this.divisionService.getmatchingDivision(
            division.divisionDescription
          );
          console.log(matchingDivision);

          this.selectedDivisionDescription = matchingDivision;
          console.log(division);
          this.nameControl?.setValue(matchingDivision);
          this.divisionForm
            .get('maxDate1')
            ?.setValue(
              formatDate(division.maxDate, this.dateFormat, this.languageFormat)
            );
          this.divisionForm
            .get('minDate1')
            ?.setValue(
              formatDate(division.minDate, this.dateFormat, this.languageFormat)
            );
          this.divisionForm
            .get('gender1')
            ?.setValue(this.selectedDivision().gender);
          if (division.maxDate2 !== null) {
            this.divisionForm
              .get('maxDate2')
              ?.setValue(
                formatDate(
                  division.maxDate2,
                  this.dateFormat,
                  this.languageFormat
                )
              );
          }
          // this.divisionForm.get('maxDate2')?.setValue(formatDate(division.maxDate2, this.dateFormat, this.languageFormat));
          if (division.minDate2 !== null) {
            this.divisionForm
              .get('minDate2')
              ?.setValue(
                formatDate(
                  division.minDate2,
                  this.dateFormat,
                  this.languageFormat
                )
              );
          }
          if (division.maxDate2 !== null || division.minDate2 !== null) {
            this.divisionForm
              .get('gender2')
              ?.setValue(this.selectedDivision().gender2);
          }
        } else {
          this.hideName = true;
        }
      }
    });
    // this.division = this.divisionService.division.subscribe(data =>

    // console.log(data);
    // Subscribe to the signal to get updated values
    //this.newDivision.update(x => this.divisionService.division());
    //console.log(this.newDivision());
  }

  save() {
    let division = new Division();
    division.divisionDescription = this.divisionForm.get('name')?.value ?? '';
    division.maxDate = new Date(
      this.divisionForm.get('maxDate1')?.value ?? DateTime.now().toISO()
    );
    division.minDate = new Date(
      this.divisionForm.get('minDate1')?.value ?? DateTime.now().toISO()
    );
    division.gender = this.divisionForm.get('gender1')?.value ?? '';
    if (division.maxDate2 !== null) {
      division.maxDate2 = new Date(
        this.divisionForm.get('maxDate2')?.value ?? DateTime.now().toISO()
      );
    }
    // this.divisionForm.get('maxDate2')?.setValue(formatDate(division.maxDate2, this.dateFormat, this.languageFormat));
    if (division.minDate2 !== null) {
      division.minDate = new Date(
        this.divisionForm.get('minDate2')?.value ?? DateTime.now().toISO()
      );
    }
    if (division.maxDate2 !== null || division.minDate2 !== null) {
      division.gender2 = this.divisionForm.get('gender2')?.value ?? '';
    }
    division.divisionId = this.divisionService.division().divisionId;
    division.companyId = 1; // get from constants
    division.seasonId = this.divisionService.division().seasonId;

    console.log(division);
    this.divisionService.save(division);
  }

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
  divisionSelected($event: any) {
    this.divisionService.createTemporaryDivision($event.value);
    this.hideNameInput.set($event.value !== 'other');
  }
  deleteRecord() {
    //TODO:  Fix delete method
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.deleteRecord();
      }
    });
  }
}
