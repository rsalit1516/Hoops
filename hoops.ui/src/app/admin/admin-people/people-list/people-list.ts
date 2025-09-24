import {
  Component,
  effect,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { PeopleSearch } from '../people-search/people-search';
import { AlphabeticalSearch } from '../../admin-shared/people-alphabet/alphabetical-search';
import { PeopleSearchResults } from '../people-search-results/people-search-results';
import {
  peopleSearchCriteria,
  PeopleService,
} from '@app/services/people.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-people-list',
  imports: [PeopleSearch, AlphabeticalSearch, PeopleSearchResults],
  template: ` <div class="row">
      <csbc-people-search [(selectedFilter)]="selectedCriteria" />
    </div>
    <div class="row">
      <csbc-alphabetical-search [(selectedLetter)]="selectedLetter" />
    </div>
    <div>
      <csbc-people-search-results />
    </div>`,
  styleUrl: './people-list.scss',
})
export class PeopleList implements OnInit {
  private readonly peopleService = inject(PeopleService);
  private readonly logger = inject(LoggerService);
  selectedLetter = model<string>('A');
  selectedCriteria = model<peopleSearchCriteria>({
    lastName: '',
    firstName: '',
    playerOnly: false,
  });

  constructor() {
    effect(() => {
      const letter = this.selectedLetter();
      this.logger.info('Selected letter changed:', letter);
      // Update criteria when letter changes
      this.selectedCriteria.update((criteria) => ({
        ...criteria,
        lastName: letter,
        firstName: '', // Reset first name when letter changes
      }));
    });
    effect(() => {
      const criteria = this.selectedCriteria();
      this.logger.info(
        'Selected criteria changed:',
        criteria.lastName,
        criteria.firstName,
        criteria.playerOnly
      );
      this.handleFilterChange(criteria); // reacts to changes
    });
  }

  ngOnInit() {
    const saved = localStorage.getItem('peopleSearchCriteria');
    this.logger.info('Loading saved search criteria:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.peopleService.updateSelectedCriteria(parsed); // or signal.
        // value = parsed if you're outside setup
        switch (parsed.lastName.length) {
          case 0:
            this.selectedLetter.set('');
            break;

          case 1:
            this.selectedLetter.set(parsed.lastName.charAt(0).toUpperCase());
            break;

          default:
            this.selectedLetter.set(''); // Default to A if no last name
        }
      } catch (e) {
        console.error('Invalid search criteria in storage', e);
        localStorage.removeItem('peopleSearchCriteria');
      }
    }
  }
  // handleLetterChange(letter: string) {
  //   // this.selectedLetter = letter;
  //   this.peopleService.updateSelectedCriteria({
  //     lastName: letter,
  //     firstName: '',
  //     playerOnly: false,
  //   });
  // }
  handleFilterChange(filter: peopleSearchCriteria) {
    this.peopleService.updateSelectedCriteria({
      lastName: filter.lastName,
      firstName: filter.firstName,
      playerOnly: filter.playerOnly,
    });
  }
}
