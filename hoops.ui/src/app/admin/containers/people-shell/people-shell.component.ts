import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PeopleSearchResultsComponent } from '@app/admin/admin-people/people-search-results/people-search-results.component';
import { PeopleSearchComponent } from '@app/admin/admin-people/people-search/people-search.component';
import { PersonalInfoComponent } from '@app/admin/admin-people/personal-info/personal-info.component';

@Component({
  selector: 'csbc-people-shell',
  imports: [
    CommonModule,
    PeopleSearchComponent,
    PeopleSearchResultsComponent,
    PersonalInfoComponent
  ],
  templateUrl: './people-shell.component.html',
  styleUrls: ['./people-shell.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class PeopleShellComponent {
  pageTitle = 'People Management';


  onSearch (row: any) { }
}
