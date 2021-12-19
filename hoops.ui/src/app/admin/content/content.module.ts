import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentShellComponent } from './containers/content-shell/content-shell.component';
import { ContentListComponent } from './components/content-list/contentList.component';
import { ContentEditComponent } from './components/content-edit/content-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { CoreModule } from 'app/core/core.module';

import { StoreModule } from '@ngrx/store';
import { reducer } from './state/content.reducer';
import { ContentListToolbarComponent } from './components/content-list-toolbar/content-list-toolbar.component';
import { ContentEffects } from './state/content.effect';
import { EffectsModule } from '@ngrx/effects';
import { ContentService } from './content.service';

@NgModule({
  imports: [
  CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CoreModule,
    ContentRoutingModule,
    StoreModule.forFeature('content', reducer),
    EffectsModule.forFeature([ContentEffects])
  ],
  exports: [ContentRoutingModule],
  declarations: [
    ContentShellComponent,
    ContentListComponent,
    ContentEditComponent,
    ContentListToolbarComponent
  ],
  providers: [ContentService]
})
export class ContentModule {}
