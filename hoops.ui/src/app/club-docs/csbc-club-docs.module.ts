import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { CsbcClubDocsComponent } from './csbc-club-docs.component';

@NgModule({
    imports: [
        SharedModule,
        CoreModule,
        CsbcClubDocsComponent
    ]
})
export class CsbcClubDocsModule { }
