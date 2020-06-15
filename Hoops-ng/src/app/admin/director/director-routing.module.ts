import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectorShellComponent } from './container/director-shell/director-shell.component';

const routes: Routes = [ {
  path: '',
  component: DirectorShellComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectorRoutingModule { }

