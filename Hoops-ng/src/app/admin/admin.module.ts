import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

import { AdminRoutingModule } from './admin-routing.module';
import { SeasonDetailComponent } from './season/seasonDetail.component';
import { SeasonListComponent } from './season/seasonList.component';
import { DivisionDetailComponent } from './division/divisionDetail.component';
import { DivisionListComponent } from './division/divisionList.component';
import { TeamListComponent } from './team/teamList.component';
import { PlayerListComponent } from './player/player-list.component';

import { DivisionMasterComponent } from './division-master/division-master.component';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AdminShellComponent } from './containers/admin-shell/admin-shell.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/admin.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects } from './state/admin.effects';
import { AdminSeasonShellComponent } from './containers/admin-season-shell/admin-season-shell.component';
import { AdminSeasonListComponent } from './components/admin-season-list/admin-season-list.component';
import { AdminDivisionListComponent } from './components/admin-division-list/admin-division-list.component';
import { AdminTeamListComponent } from './components/admin-team-list/admin-team-list.component';
import { AdminDivisionShellComponent } from './containers/admin-division-shell/admin-division-shell.component';
import { ContentModule } from './content/content.module';
import { DirectorModule } from './director/director.module';

import { ImportScheduleComponent } from './import-schedule/import-schedule.component';
import { SeasonSelectComponent } from './components/season-select/season-select.component';
import { SeasonSetupComponent } from './containers/season-setup/season-setup.component';
import { RegistrationPaymentsComponent } from './registrations-and-payments/containers/registration-payments/registration-payments.component';
import { SeasonRegistrationsComponent } from './registrations-and-payments/components/season-registrations/season-registrations.component';
import { PaymentsComponent } from './registrations-and-payments/components/payments/payments.component';
import { AdminGamesModule } from './admin-games/admin-games.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CoreModule,
    AdminRoutingModule,
    ContentModule,
    DirectorModule,
    AdminGamesModule,
    StoreModule.forFeature('admin', reducer),
    EffectsModule.forFeature([AdminEffects])
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    SeasonDetailComponent,
    SeasonListComponent,
    DivisionDetailComponent,
    DivisionListComponent,
    TeamListComponent,
    PlayerListComponent,
    DivisionMasterComponent,
    AdminShellComponent,
    AdminSeasonShellComponent,
    AdminSeasonListComponent,
    AdminDivisionListComponent,
    AdminTeamListComponent,
    AdminDivisionShellComponent,
    ImportScheduleComponent,
    SeasonSelectComponent,
    SeasonSetupComponent,
    RegistrationPaymentsComponent,
    SeasonRegistrationsComponent,
    PaymentsComponent,
  ],
  // exports: [SeasonSelectComponent]
})
export class AdminModule {}
