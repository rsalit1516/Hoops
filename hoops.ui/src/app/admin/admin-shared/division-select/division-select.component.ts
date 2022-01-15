import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Division } from '@app/domain/division';
import { Observable } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import * as fromAdmin from '../../state';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as adminActions from '../../state/admin.actions';

@Component({
  selector: 'division-select',
  templateUrl: './division-select.component.html',
  styleUrls: ['./division-select.component.scss'],
})
export class DivisionSelectComponent implements OnInit {
  @Output() selectedDivision = new EventEmitter<Division>();
  selectForm!: FormGroup;
  divisions$: Observable<Division[]>;
  // divisions: Division[];
  divisionComponent: FormControl | null | undefined;

  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {
    this.selectForm = this.fb.group({
      divisions: new FormControl(''),
    });
    this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions); //.subscribe(divisions => this.divisions = divisions);
  }

  ngOnInit(): void {
    // this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions); //.subscribe(divisions => this.divisions = divisions);
    this.divisionComponent = this.selectForm.get('division') as FormControl;
    this.divisionComponent.valueChanges.subscribe((value) => {
      this.store.dispatch(new adminActions.LoadGames());
    });
  }
  onClick(division: Division) {
    this.selectedDivision.emit(division);
    // console.log(division);
  }
}
