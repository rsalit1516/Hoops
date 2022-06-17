import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Division } from '@app/domain/division';
import { Observable } from 'rxjs';
import * as fromAdmin from '../../state';
import { select, Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import * as adminActions from '../../state/admin.actions';

@Component({
  selector: 'division-select',
  templateUrl: './division-select.component.html',
  styleUrls: ['./division-select.component.scss', '../../admin.component.scss'],
})
export class DivisionSelectComponent implements OnInit {
  @Output() selectedDivision = new EventEmitter<Division>();
  selectForm!: UntypedFormGroup;
  divisions$: Observable<Division[]>;
  divisionComponent: UntypedFormControl | null | undefined;

  constructor(private store: Store<fromAdmin.State>, private fb: UntypedFormBuilder) {
    this.selectForm = this.fb.group({
      division: new UntypedFormControl(''),
    });
    this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  }

  ngOnInit(): void {
    this.divisionComponent = this.selectForm.get('division') as UntypedFormControl;
    this.divisionComponent?.valueChanges.subscribe((value) => {
      this.store.dispatch(new adminActions.SetSelectedDivision(value));
    });
    this.store.pipe(select(fromAdmin.getSelectedDivision)).subscribe((division) => {
      this.divisionComponent?.setValue(division);
    });

  }
  onClick(division: Division) {
    // this.selectedDivision.emit(division);
    console.log(division);
  }
}
