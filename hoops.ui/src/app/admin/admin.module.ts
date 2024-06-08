import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

import { AdminRoutingModule } from './admin-routing.module';
import { SeasonDetailComponent } from './season/seasonDetail.component';
import { SeasonListComponent } from './season/seasonList.component';
import { DivisionDetailComponent } from './components/admin-division-detail/divisionDetail.component';
import { DivisionListComponent } from './components/admin-division-list/divisionList.component';
import { PlayerListComponent } from './player/player-list.component';

import { DivisionMasterComponent } from './division-master/division-master.component';



import { AdminShellComponent } from './containers/admin-shell/admin-shell.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/admin.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects } from './state/admin.effects';
import { AdminSeasonShellComponent } from './containers/admin-season-shell/admin-season-shell.component';
import { AdminSeasonListComponent } from './components/admin-season-list/admin-season-list.component';

import { AdminDivisionShellComponent } from './containers/admin-division-shell/admin-division-shell.component';
import { DirectorModule } from './director/director.module';

import { ImportScheduleComponent } from './import-schedule/import-schedule.component';
import { SeasonSetupComponent } from './containers/season-setup/season-setup.component';
import { SeasonRegistrationsComponent } from './registrations-and-payments/components/season-registrations/season-registrations.component';
import { PaymentsComponent } from './registrations-and-payments/components/payments/payments.component';
import { AdminGamesModule } from './admin-games/admin-games.module';

import { AdminGamesListComponent } from './admin-shared/admin-games-list/admin-games-list.component';
import { ContentShellComponent } from './web-content/containers/content-shell/content-shell.component';

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    // ContentModule,
    ContentShellComponent,
    DirectorModule,
    AdminGamesModule,
    AdminGamesListComponent,
    StoreModule.forFeature('admin', reducer),
    EffectsModule.forFeature([AdminEffects]),
    AdminComponent,
    AdminDashboardComponent,
    SeasonDetailComponent,
    SeasonListComponent,
    DivisionDetailComponent,
    DivisionListComponent,
    PlayerListComponent,
    DivisionMasterComponent,
    AdminShellComponent,
    AdminSeasonShellComponent,
    AdminSeasonListComponent,
    AdminDivisionShellComponent,
    ImportScheduleComponent,
    SeasonSetupComponent,
    SeasonRegistrationsComponent,
    PaymentsComponent,
],
})
export class AdminModule {}
