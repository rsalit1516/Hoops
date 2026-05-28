import { Component, inject, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

import { ScheduleGeneratorStateService } from './schedule-generator-state.service';
import { ScheduleParamsStepComponent } from './steps/schedule-params-step';
import { ScheduleDivisionsStepComponent } from './steps/schedule-divisions-step';
import { ScheduleTimePeriodsStepComponent } from './steps/schedule-time-periods-step';
import { ScheduleBlackoutStepComponent } from './steps/schedule-blackout-step';
import { SchedulePreviewStepComponent } from './steps/schedule-preview-step';

@Component({
  selector: 'app-admin-schedule-generator',
  standalone: true,
  imports: [
    MatStepperModule,
    MatButtonModule,
    ScheduleParamsStepComponent,
    ScheduleDivisionsStepComponent,
    ScheduleTimePeriodsStepComponent,
    ScheduleBlackoutStepComponent,
    SchedulePreviewStepComponent,
  ],
  providers: [ScheduleGeneratorStateService],
  templateUrl: './admin-schedule-generator.html',
  styleUrls: [
    '../../shared/scss/forms.scss',
    '../../shared/scss/cards.scss',
    '../admin.scss',
    './admin-schedule-generator.scss',
  ],
})
export class AdminScheduleGenerator implements OnInit {
  protected state = inject(ScheduleGeneratorStateService);

  ngOnInit() {
    this.state.initialize();
  }
}
