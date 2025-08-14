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
import { NewDivisionSelector } from '@app/admin/admin-shared/new-division-selector/new-division-selector';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ConfirmDialog } from '@app/admin/shared/confirm-dialog/confirm-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';
import { PeopleService } from '@app/services/people.service';
import { Person } from '@app/domain/person';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '@app/shared/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'csbc-division-detail',
  templateUrl: './divisionDetail.html',
  styleUrls: [
    '../../admin.scss',
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
    MatSnackBarModule,
    NewDivisionSelector,
    ConfirmDialog,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [DivisionService, PeopleService],
})
export class DivisionDetail implements OnInit {
  // store = inject(Store<fromAdmin.State>);
  dialog = inject(MatDialog);
  divisionService = inject(DivisionService);
  private router = inject(Router);
  private peopleService = inject(PeopleService);
  private notify = inject(NotificationService);
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
    director: this.fb.control<number | null>(null),
  });

  genders = ['M', 'F'];
  ads: Person[] = [];
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
    // Load ADs for Director dropdown, then patch director if present
    this.peopleService.getADPeople().subscribe({
      next: (ads) => {
        this.ads = ads ?? [];
        const division = this.divisionService.selectedDivision();
        if (division && division.divisionDescription !== undefined) {
          // Only patch director once ADs are ready so the control can resolve the value
          const directorValue =
            division.directorId && division.directorId > 0
              ? division.directorId
              : null;
          this.divisionForm.get('director')?.setValue(directorValue, {
            emitEvent: false,
          });
        }
      },
      error: (e) => console.error('Failed to load ADs', e),
    });

    const division = this.divisionService.selectedDivision(); // get the current selected division
    if (division) {
      const matchingDivision = this.divisionService.getmatchingDivision(
        division.divisionDescription ?? ''
      );
      this.selectedDivisionDescription = matchingDivision;
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
      });
    }
  }

  save() {
    // console.log('Save');
    let division = new Division();
    division.companyId = 1; // get from constants
    // Default to the currently selected season id; if editing, we'll override with the record's seasonId below
    division.seasonId = this.divisionService.seasonId;
    division.divisionDescription = this.divisionForm.get('name')?.value ?? '';
    division.maxDate = new Date(
      this.divisionForm.get('maxDate1')?.value ?? DateTime.now().toISO()
    );
    division.minDate = new Date(
      this.divisionForm.get('minDate1')?.value ?? DateTime.now().toISO()
    );
    division.gender = this.divisionForm.get('gender1')?.value ?? '';
    const maxDate2Val = this.divisionForm.get('maxDate2')?.value;
    if (maxDate2Val) {
      division.maxDate2 = new Date(maxDate2Val);
    }
    // this.divisionForm.get('maxDate2')?.setValue(formatDate(division.maxDate2, this.dateFormat, this.languageFormat));
    const minDate2Val = this.divisionForm.get('minDate2')?.value;
    if (minDate2Val) {
      division.minDate2 = new Date(minDate2Val);
    }
    if (division.maxDate2 || division.minDate2) {
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
      // Preserve the original season for existing records; fallback to active season for new ones
      if (_division && _division.seasonId && _division.seasonId > 0) {
        division.seasonId = _division.seasonId;
      }
      const directorVal = this.divisionForm.get('director')?.value;
      if (directorVal !== null && directorVal !== undefined) {
        division.directorId = Number(directorVal);
      } else {
        division.directorId = 0; // explicit none
      }
      // console.log(division);
      this.divisionService.save(division).subscribe({
        next: () => {
          // mark as clean and navigate after successful save
          this.divisionForm.markAsPristine();
          // Refresh list so changes are visible when returning
          const activeSeasonId = this.divisionService.seasonId;
          if (activeSeasonId && activeSeasonId > 0) {
            this.divisionService.getSeasonDivisions(activeSeasonId);
          }
          this.notify.success('Division saved');
          this.router.navigate(['/admin/division']);
        },
        error: (err) => {
          console.error('Failed to save division', err);
          this.notify.error('Failed to save division');
        },
      });
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
    const current = this.divisionService.currentDivision();
    const id = current?.divisionId ?? 0;
    if (!id) {
      this.notify.error('No division to delete');
      return;
    }

    this.divisionService.delete(id).subscribe({
      next: () => {
        // Refresh list and navigate back
        const seasonId = this.divisionService.seasonId;
        if (seasonId && seasonId > 0) {
          this.divisionService.getSeasonDivisions(seasonId);
        }
        this.notify.success('Division deleted');
        this.router.navigate(['/admin/division']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to delete division', err);
        if (err.status === 409) {
          const detail =
            (err.error && (err.error.detail || err.error.title)) ||
            'The division has related records (e.g., teams or games). Remove dependencies first.';
          this.notify.warn(detail);
        } else if (err.status === 404) {
          this.notify.error('Division not found');
        } else {
          this.notify.error('Failed to delete division');
        }
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Division?',
        message: 'Are you sure you want to delete this division?',
      },
      panelClass: 'csbc-login-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) this.deleteRecord();
    });
  }
  isFormDirty(): boolean {
    return this.divisionForm.dirty;
  }
}
