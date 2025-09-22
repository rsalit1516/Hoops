import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoggerService } from '@app/services/logger.service';
import {
  peopleSearchCriteria,
  PeopleService,
} from '@app/services/people.service';

@Component({
  selector: 'csbc-people-alphabet',
  templateUrl: './people-alphabet.html',
  styleUrls: ['./people-alphabet.scss'],
  imports: [CommonModule, MatButtonModule],
})
export class PeopleAlphabet implements OnInit {
  #peopleService = inject(PeopleService);
  private logger = inject(LoggerService);
  selectedLetter = model<string>('A'); // Use model for two-way binding

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  people: any[] = [];
  isLoading = false;
  selectedCriteria: peopleSearchCriteria = {
    lastName: 'A',
    firstName: '',
    playerOnly: false,
  };

  ngOnInit() {
    const saved = localStorage.getItem('peopleSearchCriteria');
    if (saved) {
      // if
    } // this.loadPeople(this.selectedLetter);
  }

  selectLetter(letter: string) {
    this.logger.info('Selected letter:', letter);
    this.selectedLetter.set(letter); // Update model signal - this will automatically emit
    this.selectedCriteria = {
      lastName: letter ?? '',
      firstName: '',
      playerOnly: false,
    };
    this.#peopleService.updateSelectedCriteria(this.selectedCriteria);
    // this.loadPeople(letter);
  }

  loadPeople(letter: string) {
    this.isLoading = true;
    this.selectedCriteria = {
      lastName: letter ?? '',
      firstName: '',
      playerOnly: false,
    };
    // this.#peopleService.updateSelectedCriteria(this.selectedCriteria);
    // this.#peopleService.executeSearch();
  }
  clearSelection() {
    this.selectedLetter.set('A'); // Use model signal
    this.people = [];
    this.isLoading = false;
    this.selectedCriteria = {
      lastName: 'A',
      firstName: '',
      playerOnly: false,
    };
    this.#peopleService.updateSelectedCriteria(this.selectedCriteria);
    // this.#peopleService.executeSearch();
  }
}
