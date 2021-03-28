import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* NgRx */
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';

import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';
import { UserComponent } from './user.component';

@NgModule({
  exports: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('user', reducer)
  ],
  declarations: [
    LoginComponent,
    UserComponent
  ],
  providers: [AuthService]
})
export class UserModule {}
