import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { DivisionSelectComponent } from './division-select/division-select.component';
import { SeasonSelectComponent } from './season-select/season-select.component';
import { AdminTeamListComponent } from './admin-team-list/admin-team-list.component';
import { AdminTeamDetailComponent } from './admin-team-detail/admin-team-detail.component';
import { GameTypeSelectComponent } from './game-type-select/game-type-select.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatMomentModule,
        SeasonSelectComponent,
        DivisionSelectComponent,
        AdminTeamListComponent,
        AdminTeamDetailComponent,
        GameTypeSelectComponent,
    ],
    exports: [
        SeasonSelectComponent,
        DivisionSelectComponent,
        AdminTeamDetailComponent,
        AdminTeamListComponent,
        GameTypeSelectComponent,
    ],
})
export class AdminSharedModule {}
