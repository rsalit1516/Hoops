import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { peopleSearchCriteria, PeopleService } from '@app/services/people.service';

@Component({
  selector: 'csbc-people-alphabet',
  templateUrl: './people-alphabet.html',
  styleUrls: ['./people-alphabet.scss',
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class PeopleAlphabet implements OnInit {
  #peopleService = inject(PeopleService);
  selectedLetter = input<string>('A');
  selectedLetterChange = output<string>();

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  people: any[] = [];
  isLoading = false;
  selectedCriteria: peopleSearchCriteria = {
    lastName: 'A',
    firstName: '',
    playerOnly: false,
  };

  ngOnInit () {
    const saved = localStorage.getItem('peopleSearchCriteria');
    if (saved) {
      // if
    }// this.loadPeople(this.selectedLetter);
  }

  selectLetter (letter: string) {
    this.selectedLetterChange.emit(letter);
    this.loadPeople(letter);
  }

  loadPeople (letter: string) {
    this.isLoading = true;
    this.selectedCriteria = {
      lastName: letter ?? '',
      firstName: '',
      playerOnly: false,
    };
    this.#peopleService.updateSelectedCriteria(this.selectedCriteria);
    // this.#peopleService.executeSearch();
  }
  clearSelection () {
    this.selectLetter('A');
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
