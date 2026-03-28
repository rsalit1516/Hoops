import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/director.reducer';

import { DirectorRoutingModule } from './director-routing.module';
import { DirectorShell } from './container/director-shell/director-shell';
import { DirectorList } from './component/director-list/director-list';
import { DirectorEdit } from './component/director-edit/director-edit';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectorRoutingModule,
    StoreModule.forFeature('director', reducer),
    DirectorShell,
    DirectorList,
    DirectorEdit
]
})
export class DirectorModule {}
