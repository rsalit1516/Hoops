import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  http = inject(HttpClient);
  dataService = inject(DataService);

  constructor() { }

  getData(): Observable<any> { return this.http.get<any>(this.dataService.peopleUrl); }
}
