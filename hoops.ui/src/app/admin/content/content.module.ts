import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentShellComponent } from './containers/content-shell/content-shell.component';
import { ContentListComponent } from './components/content-list/contentList.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared//shared.module';
import { CoreModule } from '@app/core/core.module';

import { StoreModule } from '@ngrx/store';
import { reducer } from './state/content.reducer';
import { ContentListToolbarComponent } from './components/content-list-toolbar/content-list-toolbar.component';
import { ContentEffects } from './state/content.effect';
import { EffectsModule } from '@ngrx/effects';
import { ContentService } from './content.service';
import { MaterialModule } from '@app/core/material/material.module';

@NgModule({
  imports: [
  CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CoreModule,
    ContentRoutingModule,
    MaterialModule,
    StoreModule.forFeature('content', reducer),
    EffectsModule.forFeature([ContentEffects])
  ],
  exports: [ContentRoutingModule],
  declarations: [
    ContentShellComponent,
    ContentListComponent,
    ContentListToolbarComponent
  ],
  providers: [ContentService]
})
export class ContentModule {}
