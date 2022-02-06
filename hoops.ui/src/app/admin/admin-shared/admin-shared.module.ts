import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { DivisionSelectComponent } from './division-select/division-select.component';
import { SeasonSelectComponent } from './season-select/season-select.component';

@NgModule({
  declarations: [SeasonSelectComponent, DivisionSelectComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [SeasonSelectComponent, DivisionSelectComponent]
})
export class AdminSharedModule { }
