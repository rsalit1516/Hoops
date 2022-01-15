import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Division } from '@app/domain/division';
import { Observable } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import * as fromAdmin from '../../state';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'csbc-division-select',
  templateUrl: './division-select.component.html',
  styleUrls: ['./division-select.component.scss']
})
export class DivisionSelectComponent implements OnInit {
@Output() selectedDivision = new EventEmitter<Division>();
divisions$: Observable<Division[]>;
  // divisions: Division[];

  constructor(private store: Store<fromAdmin.State>, private fb: FormBuilder) {
    this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions); //.subscribe(divisions => this.divisions = divisions);
  }

  ngOnInit(): void {
    // this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions); //.subscribe(divisions => this.divisions = divisions);
  }
  onClick(division: Division) {
    this.selectedDivision.emit(division);
    // console.log(division);
  }

}
