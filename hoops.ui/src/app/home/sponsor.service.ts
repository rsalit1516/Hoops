import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sponsor } from '@app/domain/sponsor';
import { DataService } from '@app/services/data.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  sponsors: Sponsor[] | undefined;
  constructor(private _http: HttpClient, public dataService: DataService) {}

  getSeasonSponsors(): Observable<Sponsor[]> {
    return this._http.get<Sponsor[]>(this.dataService.getCurrentSponsors).pipe(
      map((response) => (this.sponsors = response)),
      tap((data) => console.log('All: ' + JSON.stringify(data))),
      catchError(this.dataService.handleError('getGames', []))
    );
  }
}
