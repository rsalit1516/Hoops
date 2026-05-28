import { Component, inject } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScheduleGeneratorStateService } from '../schedule-generator-state.service';

@Component({
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
