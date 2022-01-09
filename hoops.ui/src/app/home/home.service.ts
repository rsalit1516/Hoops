import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebContent } from '@app/domain/webContent';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { Sponsor } from '@app/domain/sponsor';

@Injectable()
export class HomeService {
  sponsorUrl: string;

  constructor(private _http: HttpClient, public dataService: DataService) {
    this.sponsorUrl = this.dataService.sponsorUrl;
  }
  getContents(): Observable<WebContent[]> {
    return this._http
      .get<WebContent[]>(this.dataService.getActiveWebContentUrl);
  }
  getSponsorUrl(): Observable<Sponsor[]> {
    return this._http
      .get<Sponsor[]>(this.sponsorUrl);
  }
}
