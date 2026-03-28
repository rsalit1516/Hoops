import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectorShell } from './container/director-shell/director-shell';

const routes: Routes = [ {
  path: '',
  component: DirectorShell,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectorRoutingModule { }

