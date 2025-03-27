import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Division } from '@app/domain/division';
import { Observable } from 'rxjs';
import * as fromAdmin from '../../state';
import { select, Store } from '@ngrx/store';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as adminActions from '../../state/admin.actions';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor } from '@angular/common';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'division-select',
  templateUrl: './division-select.component.html',
  styleUrls: ['./../../../shared/scss/select.scss',
    './../../../shared/scss/forms.scss',
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    AsyncPipe,
  ]
})
export class DivisionSelectComponent implements OnInit {
  // readonly selectedDivision = output<Division>();
  @Output() divisionChanged = new EventEmitter<Division>();
  readonly divisionService = inject(DivisionService);

  selectForm!: UntypedFormGroup;
  // divisions$: Observable<Division[]>;
  divisionComponent: UntypedFormControl | null | undefined;
  selectedDivision: Division | null = null;

  constructor (private store: Store<fromAdmin.State>) {
    // this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  }

  ngOnInit (): void {
    // this.store.pipe(select(fromAdmin.getSelectedDivision)).subscribe((division) => {
    //   if (division == null) {
    //     this.selectedDivision = null;
    //   } else {
    //     if (division!.divisionId !== null) {
    //       this.selectedDivision = division;
    //       this.divisionService.updateSelectedDivision(division!);
    //     }
    //     this.divisionComponent?.setValue(division);
    //   }
    // });

  }
  changeDivision (division: Division | null) {
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.divisionService.updateSelectedDivision(division!);
  }
  onChange (value: Division) {
    console.log('Division = ', value);
    this.divisionService.updateSelectedDivision(value!);
    this.divisionChanged.emit(value);
  }
}
