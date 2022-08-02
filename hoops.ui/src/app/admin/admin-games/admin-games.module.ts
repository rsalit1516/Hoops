import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGamesRoutingModule } from './admin-games-routing.module';
import { AdminGamesShellComponent } from './containers/admin-games-shell/admin-games-shell.component';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { AdminGamesPlayoffsDetailComponent } from './components/admin-games-playoffs-detail/admin-games-playoffs-detail.component';
import { AdminGamesPlayoffsListComponent } from './components/admin-games-playoffs-list/admin-games-playoffs-list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminGamesRoutingModule,
    CoreModule,
    SharedModule,
    AdminSharedModule,
  ],
  declarations: [
    AdminGamesShellComponent,
    AdminGamesPlayoffsDetailComponent,
    AdminGamesPlayoffsListComponent,
  ],
})
export class AdminGamesModule {}
