import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
  declarations: []
})
export class CoreModule {}
