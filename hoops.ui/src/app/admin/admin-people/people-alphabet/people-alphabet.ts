import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
export class PeopleAlphabetComponent implements OnInit {
  #peopleService = inject(PeopleService);
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter = 'A';
  people: any[] = [];
  isLoading = false;
  selectedCriteria: peopleSearchCriteria = {
    lastName: '',
    firstName: '',
    playerOnly: false,
  };

  ngOnInit () {
    // this.loadPeople(this.selectedLetter);
  }

  selectLetter (letter: string) {
    this.selectedLetter = letter;
    this.loadPeople(letter);
  }

  loadPeople (letter: string) {
    this.isLoading = true;
    this.selectedCriteria = {
      lastName: letter ?? '',
      firstName: '',
      playerOnly: false,
    };
    // Replace with actual service call
    setTimeout(() => {
      // Simulated API response
      this.people = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `${ letter } Person ${ i + 1 }`
      }));
      this.isLoading = false;
    }, 500);
    this.#peopleService.updateSelectedCriteria(this.selectedCriteria);
    this.#peopleService.executeSearch();
  }
}
