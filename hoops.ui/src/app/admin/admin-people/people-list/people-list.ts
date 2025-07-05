import { Component, inject, OnInit } from '@angular/core';
import { PeopleSearch } from '../people-search/people-search';
import { PeopleAlphabet } from '../people-alphabet/people-alphabet';
import { PeopleSearchResultsComponent } from '../people-search-results/people-search-results.component';
import { PeopleService } from '@app/services/people.service';

@Component({
  selector: 'csbc-people-list',
  imports: [PeopleSearch,
    PeopleAlphabet,
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
export class PeopleList implements OnInit {
  #peopleService = inject(PeopleService);;
  ngOnInit () {
    const saved = localStorage.getItem('peopleSearchCriteria');
    console.log('Loading saved search criteria:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.#peopleService.updateSelectedCriteria(parsed); // or signal.value = parsed if you're outside setup
      } catch (e) {
        console.error('Invalid search criteria in storage', e);
        localStorage.removeItem('peopleSearchCriteria');
      }
    }
  }

}
