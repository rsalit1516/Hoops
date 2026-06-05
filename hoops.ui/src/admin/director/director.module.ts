import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectorRoutingModule } from './director-routing.module';
import { DirectorShell } from './container/director-shell/director-shell';
import { DirectorList } from './component/director-list/director-list';
import { DirectorEdit } from './component/director-edit/director-edit';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectorRoutingModule,
    DirectorShell,
    DirectorList,
    DirectorEdit
]
})
export class DirectorModule {}
