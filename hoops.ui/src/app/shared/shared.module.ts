import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { CoreModule } from '@app/core/core.module';
import { PageNotFoundComponent } from '@app/app.not-found.component';
import { CsbcSeasonSelectComponent } from './season-select/csbc-season-select.component';
import { CsbcCardComponent } from './csbc-card/csbc-card.component';

@NgModule({
    imports: [CommonModule, FormsModule, CoreModule],
    exports: [CsbcSeasonSelectComponent],
    declarations: [
        PageNotFoundComponent,
        CsbcSeasonSelectComponent,
        CsbcCardComponent
    ]
})
export class SharedModule {}
