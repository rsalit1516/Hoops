import { NgModule } from '@angular/core';

import { AdminRouting } from './admin-routing';
import { AdminGamesModule } from './admin-games/admin-games.module';

@NgModule({
  imports: [
    AdminRouting,
    AdminGamesModule,
  ],
})
export class AdminModule { }
