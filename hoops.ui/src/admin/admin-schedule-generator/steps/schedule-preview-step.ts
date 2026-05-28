import { Component, effect, inject, viewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScheduleGeneratorStateService } from '../schedule-generator-state.service';

@Component({
  selector: 'app-schedule-preview-step',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './schedule-preview-step.html',
  styleUrls: ['../admin-schedule-generator.scss'],
})
export class SchedulePreviewStepComponent {
  protected s = inject(ScheduleGeneratorStateService);

  private readonly sortRef = viewChild(MatSort);
  private readonly paginatorRef = viewChild<MatPaginator>('paginator');

  constructor() {
    effect(() => {
      const sort = this.sortRef();
      if (sort) {
        this.s.previewDataSource.sort = sort;
        this.s.previewDataSource.sortingDataAccessor = (item, col) => {
          if (col === 'gameDate') return item.gameDate;
          if (col === 'division') return item.divisionName;
          if (col === 'location') return item.locationName;
          if (col === 'home') return item.homeTeamName;
          if (col === 'visiting') return item.visitingTeamName;
          return '';
        };
      }
    });
    effect(() => {
      this.s.previewDataSource.paginator = this.paginatorRef() ?? null;
    });
  }
}
