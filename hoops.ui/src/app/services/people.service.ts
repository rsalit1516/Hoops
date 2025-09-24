import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { Constants } from '../shared/constants';
import { Person } from '@app/domain/person';
import { first } from 'rxjs-compat/operator/first';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);
  private readonly logger = inject(LoggerService);
  initUrl = Constants.SEARCH_PEOPLE_URL;
  searchUrl = '';
  householdMembers = signal<Person[]>([]);
  private selectedCriteria = signal<peopleSearchCriteria>({
    lastName: '',
    firstName: '',
    playerOnly: false,
  });

  updateSelectedCriteria(criteria: peopleSearchCriteria) {
    this.selectedCriteria.set(criteria);
  }
  private _results = signal<Person[]>([]);
  get results() {
    return this._results.asReadonly();
  }
  updateResults(value: Person[]) {
    this._results.set(value);
  }
  private _selectedPerson = signal<Person | null>(null);
  get selectedPerson() {
    return this._selectedPerson.asReadonly();
  }
  updateSelectedPerson(person: Person) {
    this._selectedPerson.set(person);
  }

  constructor() {
    effect(() => {
      this.logger.info('[People Service] ' + this.selectedCriteria);
      this.executeSearch();
    });
  }

  getData(): Observable<any> {
    return this.http.get<any>(Constants.peopleUrl);
  }
  getADPeople(): Observable<any> {
    return this.http.get<Person[]>(Constants.GET_ADS_URL);
  }
  private searchPeople$(): Observable<Person[] | undefined> {
    return this.http.get<Person[]>(this.searchUrl, { responseType: 'json' });
  }
  getHouseholdMembers(id: number): void {
    //     const url = Constants.GET_HOUSEHOLD_MEMBERS_URL + '/' + this.selectedRecordSignal()?.houseId;
    //  this.logger.info('URL: ', url);

    this.getHouseholdMembers$(id).subscribe((response) => {
      this.logger.info('Household Members: ', response);
      this.householdMembers.set(response);
      return response;
    });
  }
  private getHouseholdMembers$(id: number): Observable<Person[]> {
    const url = Constants.GET_HOUSEHOLD_MEMBERS_URL + '/' + id;
    this.logger.info('URL: ', url);
    return this.http.get<Person[]>(url, { responseType: 'json' });
  }
  constructQueryString(criteria: peopleSearchCriteria): string {
    let url = this.initUrl;

    if (criteria == null) {
      return '';
    }
    if (criteria.lastName !== '') {
      url += '?lastName=' + criteria.lastName;
    }
    if (criteria.firstName !== '') {
      if (url.indexOf('?') === -1) {
        url += '?firstName=' + criteria.firstName;
      } else {
        url += '&firstName=' + criteria.firstName;
      }
    }
    if (criteria.playerOnly) {
      if (url.indexOf('?') === -1) {
        url += '?playerOnly=true';
      } else {
        url += '&playerOnly=true';
      }
    }
    this.searchUrl = url;
    return url;
    // add additional criteria as needed
    // https://localhost:5001/api/Household/search?name=salit&email=richard.salit%40gmail.com
  }
  executeSearch() {
    this.searchUrl = this.constructQueryString(this.selectedCriteria());
    localStorage.setItem(
      'peopleSearchCriteria',
      JSON.stringify(this.selectedCriteria())
    );

    this.searchPeople$().subscribe((response) => {
      this.logger.info('Search People: ', response);
      this.updateResults(response!);
    });
  }
}
export interface peopleSearchCriteria {
  lastName: string;
  firstName: string;
  playerOnly: boolean;
}
