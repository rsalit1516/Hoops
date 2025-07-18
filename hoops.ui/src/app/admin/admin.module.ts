import { NgModule } from '@angular/core';

import { AdminRouting } from './admin-routing';

import { StoreModule } from '@ngrx/store';
import { reducer } from './state/admin.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects } from './state/admin.effects';

import { AdminGamesModule } from './admin-games/admin-games.module';

@NgModule({
  imports: [
    AdminRouting,
    AdminGamesModule,
    StoreModule.forFeature('admin', reducer),
    EffectsModule.forFeature([AdminEffects]),

  ],
})
export class AdminModule { }
