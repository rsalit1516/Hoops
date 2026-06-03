import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ScheduleGeneratorStateService } from '../schedule-generator-state.service';

@Component({
  selector: 'app-schedule-time-periods-step',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './schedule-time-periods-step.html',
})
export class ScheduleTimePeriodsStepComponent {
  protected s = inject(ScheduleGeneratorStateService);
}
