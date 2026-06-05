import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScheduleGeneratorStateService } from '../schedule-generator-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-divisions-step',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './schedule-divisions-step.html',
})
export class ScheduleDivisionsStepComponent {
  protected s = inject(ScheduleGeneratorStateService);
}
