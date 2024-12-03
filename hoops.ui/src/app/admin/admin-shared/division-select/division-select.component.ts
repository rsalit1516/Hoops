import { Component, OnInit, Input, output } from '@angular/core';
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

@Component({
    selector: 'division-select',
    templateUrl: './division-select.component.html',
    styleUrls: ['./../../../shared/scss/select.scss'],
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
  readonly selectedDivision = output<Division>();
  selectForm!: UntypedFormGroup;
  divisions$: Observable<Division[]>;
  divisionComponent: UntypedFormControl | null | undefined;

  constructor(private store: Store<fromAdmin.State>, private fb: UntypedFormBuilder) {
    this.selectForm = this.fb.group({
      divisionControl: new UntypedFormControl(''),
    });
    this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  }

  ngOnInit(): void {
    this.divisionComponent = this.selectForm.get('divisionControl') as UntypedFormControl;
    this.divisionComponent?.valueChanges.subscribe((value) => {
      // console.log(value);
      this.store.dispatch(new adminActions.SetSelectedDivision(value));
    });
    this.store.pipe(select(fromAdmin.getSelectedDivision)).subscribe((division) => {
      this.divisionComponent?.setValue(division);
    });

  }
  onClick(division: Division) {
    // console.log(division);
  }
}
