import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { Constants } from '../shared/constants';
import { Person } from '@app/domain/person';
import { first } from 'rxjs-compat/operator/first';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  #http = inject(HttpClient);
  dataService = inject(DataService);
  inithUrl = Constants.SEARCH_PEOPLE_URL;
  searchUrl = '';
  householdMembers = signal<Person[]>([]);
  private selectedCriteria = signal<peopleSearchCriteria>({
    lastName: '',
    firstName: '',
    playerOnly: false,
  });

  updateSelectedCriteria (criteria: peopleSearchCriteria) {
    this.selectedCriteria.set(criteria);
  }
  private _results = signal<Person[]>([]);
  get results () {
    return this._results.asReadonly();
  }
  updateResults (value: Person[]) {
    this._results.set(value);
  }

  constructor () { }

  getData (): Observable<any> {
    return this.#http.get<any>(Constants.peopleUrl);
  }
  getADPeople (): Observable<any> {
    return this.#http.get<Person[]>(Constants.GET_ADS_URL);
  }
  private searchPeople$(): Observable<Person[] | undefined> {
    console.log('Search URL: ', this.searchUrl);
    return this.#http.get<Person[]>(this.searchUrl, { responseType: 'json' });
  }
  getHouseholdMembers (id: number): void {
    //     const url = Constants.GET_HOUSEHOLD_MEMBERS_URL + '/' + this.selectedRecordSignal()?.houseId;
    //  console.log('URL: ', url);

    this.getHouseholdMembers$(id).subscribe(response => {
      console.log('Household Members: ', response);
      this.householdMembers.set(response);
      return response;
    });
  }
  private getHouseholdMembers$ (id: number): Observable<Person[]> {
    const url = Constants.GET_HOUSEHOLD_MEMBERS_URL + '/' + id;
    console.log('URL: ', url);
    return this.#http.get<Person[]>(url, { responseType: 'json' });
  }
  constructQueryString (criteria: peopleSearchCriteria): string {
    let url = this.inithUrl;

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
    console.log('Search URL: ', url);
    return url;
    // add additional criteria as needed
    // https://localhost:5001/api/Household/search?name=salit&email=richard.salit%40gmail.com
  }
  executeSearch () {
    console.log(this.selectedCriteria());
    this.searchUrl = this.constructQueryString(this.selectedCriteria());
    this.searchPeople$().subscribe(response => {
      this.updateResults(response!);
      console.log(this.results);
      //       console.log('Household data: ', this.householdsResult());
    });
  }
}
export interface peopleSearchCriteria {
  lastName: string;
  firstName: string;
  playerOnly: boolean;
}
