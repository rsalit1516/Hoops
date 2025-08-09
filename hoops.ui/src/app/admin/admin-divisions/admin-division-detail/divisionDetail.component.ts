import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
  ChangeDetectionStrategy,
  effect,
  computed,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Division } from '../../../domain/division';
import { DivisionService } from '@app/services/division.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NewDivisionSelectorComponent } from '@app/admin/admin-shared/new-division-selector/new-division-selector.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ConfirmDialogComponent } from '@app/admin/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [DivisionService, PeopleService],
})
export class DivisionDetailComponent implements OnInit {
  // store = inject(Store<fromAdmin.State>);
  dialog = inject(MatDialog);
  private divisionService = inject(DivisionService);
  private router = inject(Router);
  fb = inject(FormBuilder);

  // selectedDivision = signal<Division>(new Division());
  selectedDivisionDescription: string = ''; // =
  directorId: number = 0;
  division = signal<Division>(new Division());
  // ads = toSignal(this.#peopleService.getADPeople());

  nameControl = new FormControl('', Validators.required);
  standardDivisions: WritableSignal<string[]> = signal(
    this.divisionService.standardDivisions()
  );
  divisionForm = this.fb.group({
    name: [''],
    maxDate1: [
      this.division() && this.division().maxDate
        ? formatDate(this.division().maxDate ?? new Date(), 'yyyy-MM-dd', 'en')
        : '',
      [Validators.required],
    ],
    minDate1: [
      this.division() && this.division().minDate
        ? formatDate(this.division().minDate ?? new Date(), 'yyyy-MM-dd', 'en')
        : '',
      [Validators.required],
    ],
    maxDate2: [
      this.division() && this.division().maxDate2
        ? formatDate(this.division().maxDate2 ?? new Date(), 'yyyy-MM-dd', 'en')
        : '',
    ],
    minDate2: [
      this.division() && this.division().minDate2
        ? formatDate(this.division().minDate2 ?? new Date(), 'yyyy-MM-dd', 'en')
        : '',
    ],
    gender1: [''],
    gender2: [''],
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
  selectedDivision = computed(() => this.divisionService.selectedDivision());
  constructor() {
    effect(() => {
      console.log(this.divisionService.selectedDivision);

      // patchForm();
    });
  }
  ngOnInit(): void {
    let currentDivision = this.divisionService.currentDivision();
    const division = this.divisionService.selectedDivision(); // get the current selected division

    /* Need to fix this!!!!! */
    if (division !== null) {
      if (division?.divisionDescription !== undefined) {
        const matchingDivision = this.divisionService.getmatchingDivision(
          division.divisionDescription
        );
        console.log(matchingDivision);

        this.selectedDivisionDescription = matchingDivision;
        console.log(division);
        this.divisionForm.patchValue({
          name: division.divisionDescription,
          maxDate1: division.maxDate
            ? new Date(division.maxDate).toISOString().split('T')[0]
            : '',
          minDate1: division.minDate
            ? new Date(division.minDate).toISOString().split('T')[0]
            : '',
          gender1: division.gender,
          maxDate2: division.maxDate2
            ? new Date(division.maxDate2).toISOString().split('T')[0]
            : '',
          minDate2: division.minDate2
            ? new Date(division.minDate2).toISOString().split('T')[0]
            : '',
          gender2: division.gender2,
        }); // this.divisionForm.get('maxDate2')?.setValue(formatDate(division.maxDate2, this.dateFormat, this.languageFormat));
      }
    }
  }

  save() {
    // console.log('Save');
    let division = new Division();
    division.companyId = 1; // get from constants
    division.seasonId = this.divisionService.seasonId;
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
      division.minDate2 = new Date(
        this.divisionForm.get('minDate2')?.value ?? DateTime.now().toISO()
      );
    }
    if (division.maxDate2 !== null || division.minDate2 !== null) {
      division.gender2 = this.divisionForm.get('gender2')?.value ?? '';
    }
    if (this.divisionService.currentDivision() == undefined) {
      throw new Error('Division is not defined');
    } else {
      let _division = this.divisionService.currentDivision();
      if (_division!.divisionId === undefined) {
        division.divisionId = 0;
      } else {
        division.divisionId = _division!.divisionId;
      }
      if (this.divisionForm.get('director')?.value !== null) {
        division.directorId =
          Number(this.divisionForm.get('director')?.value) ?? 0;
      }
      // console.log(division);
      this.divisionService.save(division);

      this.router.navigate(['/admin/division']);
    }
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
  isFormDirty(): boolean {
    return this.divisionForm.dirty;
  }
}
