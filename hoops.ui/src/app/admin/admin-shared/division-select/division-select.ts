import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
  computed,
  effect,
} from '@angular/core';
import { Division } from '@app/domain/division';
import {
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'division-select',
  template: `<mat-form-field>
    <mat-label>{{ title }}</mat-label>
    <mat-select [(value)]="division" class="form-control">
      @for( division of divisionService.seasonDivisions(); track division) {
      <mat-option [value]="division" (click)="changeDivision(division)">
        {{ division.divisionDescription }}
      </mat-option>
      }
    </mat-select>
  </mat-form-field> `,
  styleUrls: [
    './../../../shared/scss/select.scss',
    './../../../shared/scss/forms.scss',
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
  ],
})
export class DivisionSelect implements OnInit {
  // readonly selectedDivision = output<Division>();
  @Output() divisionChanged = new EventEmitter<Division>();
  readonly divisionService = inject(DivisionService);
  title = 'Division';
  divisionComponent: UntypedFormControl | null | undefined;
  selectedDivision = computed(() => this.divisionService.selectedDivision());
  division = this.selectedDivision();
  constructor() {
    effect(() => {
      this.division = this.selectedDivision();
    });
  }

  ngOnInit(): void {}
  changeDivision(division: Division | null) {
    this.divisionService.updateSelectedDivision(division!);
  }
}
