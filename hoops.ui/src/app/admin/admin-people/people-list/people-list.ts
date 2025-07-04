import { Component } from '@angular/core';
import { PeopleSearchComponent } from '../people-search/people-search.component';
import { PeopleAlphabetComponent } from '../people-alphabet/people-alphabet';
import { PeopleSearchResultsComponent } from '../people-search-results/people-search-results.component';

@Component({
  selector: 'csbc-people-list',
  imports: [PeopleSearchComponent,
    PeopleAlphabetComponent,
    PeopleSearchResultsComponent
  ],
  template: `
  <div class="row">
  <csbc-people-search />
</div>
<div class="row">
  <csbc-people-alphabet />
</div>
<div>
  <csbc-people-search-results />
</div>`,
  styleUrl: './people-list.scss'
})
export class PeopleListComponent {

}
