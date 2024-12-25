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
  constants = inject(Constants);

  constructor() { }

  getData(): Observable<any> {
    return this.http.get<any>(this.constants.peopleUrl);
  }
  getADPeople(): Observable<any> {
    return this.http.get<any>(this.constants.getADsUrl);
  }
}
