import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* NgRx */
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';

import { AuthService } from './auth.service';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('user', reducer)],
  declarations: [],
  providers: [AuthService]
})
export class UserModule {}
