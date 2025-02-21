import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Division } from '@app/domain/division';
import { Observable } from 'rxjs';
import * as fromAdmin from '../../state';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as adminActions from '../../state/admin.actions';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { EventEmitter } from 'stream';

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
  selectForm!: UntypedFormGroup;
  divisions$: Observable<Division[]>;
  divisionComponent: UntypedFormControl | null | undefined;
  selectedValue: number | undefined;

  constructor (private store: Store<fromAdmin.State>, private fb: UntypedFormBuilder) {
    this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  }

  ngOnInit (): void {
    this.store.pipe(select(fromAdmin.getSelectedDivision)).subscribe((division) => {
      this.divisionComponent?.setValue(division);
    });

  }
  changeDivision (division: Division) {
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
  }
  onChange (value: Division) {
    console.log(value);
    this.divisionChanged.emit(value);
  }
}
