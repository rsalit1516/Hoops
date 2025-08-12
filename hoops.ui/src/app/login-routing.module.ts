import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService }          from '@app/services/auth.service';
import { Login }       from './login';
import { AuthGuard } from './auth/auth.guard';

const loginRoutes: Routes = [
  { path: 'login', component: Login }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    AuthService
  ]
})
export class LoginRoutingModule {}
