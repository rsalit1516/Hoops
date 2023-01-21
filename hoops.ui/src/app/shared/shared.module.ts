import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { CoreModule } from '@app/core/core.module';
import { PageNotFoundComponent } from '@app/app.not-found.component';
import { MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/legacy-dialog';
import { CsbcSeasonSelectComponent } from './season-select/csbc-season-select.component';
import { CsbcCardComponent } from './csbc-card/csbc-card.component';

@NgModule({
    imports: [CommonModule, FormsModule, CoreModule],
    exports: [CsbcSeasonSelectComponent],
    declarations: [
        LoginDialogComponent,
        PageNotFoundComponent,
        CsbcSeasonSelectComponent,
        CsbcCardComponent
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
    ]
})
export class SharedModule {}
