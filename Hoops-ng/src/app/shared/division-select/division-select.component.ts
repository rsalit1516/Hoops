import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Division } from 'app/domain/division';
import { Observable } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { emit } from 'cluster';

@Component({
  selector: 'csbc-division-select',
  templateUrl: './division-select.component.html',
  styleUrls: ['./division-select.component.css']
})
export class DivisionSelectComponent implements OnInit {
@Input() divisions$ : Observable<Division[]>;
@Input() division: Division;
@Output() selectedDivision = new EventEmitter<Division>();
  constructor() { }

  ngOnInit(): void {
  }
  onClick(division: Division) {
    this.selectedDivision.emit(division);
    console.log(division);
  }

}
