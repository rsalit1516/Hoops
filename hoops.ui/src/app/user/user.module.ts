import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* NgRx */
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';

// import { AuthService } from './auth.service';
import { Login } from './login';
import { User } from './user';
import { AuthService } from '@app/services/auth.service';

@NgModule({
    exports: [],
    imports: [
        CommonModule,
        StoreModule.forFeature('user', reducer),
        // Login,
        // User
    ],
    providers: [AuthService]
})
export class UserModule {}
