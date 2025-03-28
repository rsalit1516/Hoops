import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Division } from '@app/domain/division';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor } from '@angular/common';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'division-select',
  template: `<mat-form-field>
  <mat-label>Division</mat-label>
  <mat-select
    [(value)]="selectedDivision"
    (selectionChange)="onChange($event.value)"
    class="form-control"
  >
    <mat-option [value]="null" (click)="changeDivision(null)">
      All
    </mat-option>
    @for( division of divisionService.seasonDivisions(); track division) {
    <mat-option [value]="division" (click)="changeDivision(division)">
      {{ division.divisionDescription }}
    </mat-option>
    }
  </mat-select>
</mat-form-field>
`,
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

  constructor () {
    // this.divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  }

  ngOnInit (): void {

  }
  changeDivision (division: Division | null) {
    this.divisionService.updateSelectedDivision(division!);
  }
  onChange (value: Division) {
    console.log('Division = ', value);
    this.divisionService.updateSelectedDivision(value!);
    this.divisionChanged.emit(value);
  }
}
