import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { CoreModule } from 'app/core/core.module';
import { PageNotFoundComponent } from 'app/app.not-found.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { CsbcSeasonSelectComponent } from './season-select/csbc-season-select.component';
import { DivisionSelectComponent } from './division-select/division-select.component';

@NgModule({
  imports: [CommonModule, FormsModule, CoreModule],
  exports: [CsbcSeasonSelectComponent, DivisionSelectComponent],
  declarations: [
    LoginDialogComponent,
    PageNotFoundComponent,
    CsbcSeasonSelectComponent,
    DivisionSelectComponent
  ],
  entryComponents: [LoginDialogComponent],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ]
})
export class SharedModule {}
