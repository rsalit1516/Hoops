import { Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  computed,
  effect, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'division-select',
  template: `<mat-form-field floatLabel="always">
    <mat-label>{{ title }}</mat-label>
    <mat-select [(value)]="division" class="form-control">
      @if (includeAll) {
      <mat-option [value]="allDivisionsSentinel" (click)="changeDivision(allDivisionsSentinel)">
        All Divisions
      </mat-option>
      }
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
  @Input() includeAll = false;
  readonly divisionService = inject(DivisionService);
  private logger = inject(LoggerService);
  title = 'Division';
  allDivisionsSentinel: Division = Object.assign(new Division(), {
    divisionId: 0,
    divisionDescription: 'All Divisions',
    seasonId: 0,
  });
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
