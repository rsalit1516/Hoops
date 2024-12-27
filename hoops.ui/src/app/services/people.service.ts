import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import {Constants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  http = inject(HttpClient);
  dataService = inject(DataService);

  constructor() { }

  getData(): Observable<any> {
    return this.http.get<any>(Constants.peopleUrl);
  }
  getADPeople(): Observable<any> {
    return this.http.get<any>(Constants.GET_ADS_URL);
  }
}
