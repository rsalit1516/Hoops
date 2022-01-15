import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGamesRoutingModule } from './admin-games-routing.module';
import { AdminGamesListComponent } from './components/admin-games-list/admin-games-list.component';
import { AdminGamesShellComponent } from './containers/admin-games-shell/admin-games-shell.component';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdminGamesRoutingModule,
    CoreModule,
    SharedModule,
    AdminSharedModule
  ],
  declarations: [AdminGamesListComponent, AdminGamesShellComponent],
})
export class AdminGamesModule {}
