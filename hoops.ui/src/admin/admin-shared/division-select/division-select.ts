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
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'division-select',
  template: `<mat-form-field floatLabel="always">
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
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
],
})
export class DivisionSelect implements OnInit {
  // readonly selectedDivision = output<Division>();
  @Output() divisionChanged = new EventEmitter<Division>();
  readonly divisionService = inject(DivisionService);
  private logger = inject(LoggerService);
  title = 'Division';
  divisionComponent: UntypedFormControl | null | undefined;
  selectedDivision = computed(() => this.divisionService.selectedDivision());
  division = this.selectedDivision();
  constructor() {
    effect(() => {
      this.division = this.selectedDivision();
    });
  }

  ngOnInit(): void {
    this.logger.debug('Season divisions:', this.divisionService.seasonDivisions());
  }
  changeDivision(division: Division | null) {
    this.divisionService.updateSelectedDivision(division!);
  }
}
