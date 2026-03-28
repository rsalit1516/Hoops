import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGamesRoutingModule } from './admin-games-routing';
import { AdminGamesShell } from './admin-games-shell/admin-games-shell';



import { AdminGamesPlayoffsDetail } from './admin-games-playoffs-detail/admin-games-playoffs-detail';
import { AdminGamesPlayoffsList } from './admin-games-playoffs-list/admin-games-playoffs-list';
import { AdminGameDetail } from './admin-game-detail/admin-game-detail';
import { AdminGamesList } from './admin-games-list/admin-games-list';

@NgModule({
    imports: [
        CommonModule,
        AdminGamesRoutingModule,
        AdminGameDetail,
        AdminGamesList,
        AdminGamesShell,
        AdminGamesPlayoffsDetail,
        AdminGamesPlayoffsList
    ],
})
export class AdminGamesModule { }
