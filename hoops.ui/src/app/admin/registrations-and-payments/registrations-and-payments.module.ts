import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftedPlayersComponent } from './components/drafted-players/drafted-players.component';
import { PlayerInfoComponent } from './components/player-info/player-info.component';
import { DraftInfoComponent } from './components/draft-info/draft-info.component';


@NgModule({
  declarations: [    DraftedPlayersComponent,
    PlayerInfoComponent,
    DraftInfoComponent,
],
  imports: [
    CommonModule
  ]
})
export class RegistrationsAndPaymentsModule { }
