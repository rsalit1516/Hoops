import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentShellComponent } from './containers/content-shell/content-shell.component';
import { ContentListComponent } from './components/content-list/contentList.component';
import { ContentEditComponent } from './components/content-edit/content-edit.component';
import { PageNotFoundComponent } from 'app/app.not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ContentShellComponent,
    children: [
        { path: '', component:ContentListComponent },
        { path: 'edit', component: ContentEditComponent },
        { path: 'list', component: ContentListComponent },
        { path: '**', component: PageNotFoundComponent }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {}
