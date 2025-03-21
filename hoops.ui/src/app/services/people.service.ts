import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { Constants } from '../shared/constants';
import { Person } from '@app/domain/person';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  #http = inject(HttpClient);
  dataService = inject(DataService);

  householdMembers = signal<Person[]>([]);

  constructor() { }

  getData(): Observable<any> {
    return this.#http.get<any>(Constants.peopleUrl);
  }
  getADPeople(): Observable<any> {
    return this.#http.get<Person[]>(Constants.GET_ADS_URL);
  }

  getHouseholdMembers(id: number): void {
    //     const url = Constants.GET_HOUSEHOLD_MEMBERS_URL + '/' + this.selectedRecordSignal()?.houseId;
    //  console.log('URL: ', url);

    this.getHouseholdMembers$(id).subscribe(response => {
      console.log('Household Members: ', response);
      this.householdMembers.set(response);
      return response;
    });
  }
  private getHouseholdMembers$(id: number): Observable<Person[]> {
    const url = Constants.GET_HOUSEHOLD_MEMBERS_URL + '/' + id;
    console.log('URL: ', url);
    return this.#http.get<Person[]>(url, { responseType: 'json' });
  }


}
