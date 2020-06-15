import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/director.reducer';

import { DirectorRoutingModule } from './director-routing.module';
import { DirectorShellComponent } from './container/director-shell/director-shell.component';
import { DirectorListComponent } from './component/director-list/director-list.component';
import { DirectorEditComponent } from './component/director-edit/director-edit.component';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    DirectorRoutingModule,
    StoreModule.forFeature('director', reducer)
  ],
  declarations: [
    DirectorShellComponent,
    DirectorListComponent,
    DirectorEditComponent
  ]
})
export class DirectorModule {}
