import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGamesRoutingModule } from './admin-games-routing.module';
import { AdminGamesShellComponent } from './containers/admin-games-shell/admin-games-shell.component';



import { AdminGamesPlayoffsDetailComponent } from './components/admin-games-playoffs-detail/admin-games-playoffs-detail.component';
import { AdminGamesPlayoffsListComponent } from './components/admin-games-playoffs-list/admin-games-playoffs-list.component';
import { AdminGameDetailComponent } from '../admin-shared/admin-game-detail/admin-game-detail.component';
import { AdminGamesListComponent } from '../admin-shared/admin-games-list/admin-games-list.component';

@NgModule({
    imports: [
    CommonModule,
    AdminGamesRoutingModule,
    AdminGameDetailComponent,
    AdminGamesListComponent,
    AdminGamesShellComponent,
    AdminGamesPlayoffsDetailComponent,
    AdminGamesPlayoffsListComponent
],
})
export class AdminGamesModule {}
