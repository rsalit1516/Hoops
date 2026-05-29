import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SponsorListItem } from '@app/domain/sponsor-profile';
import { Constants } from '@app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  private http = inject(HttpClient);

  getSponsors(): Observable<SponsorListItem[]> {
    return this.http.get<SponsorListItem[]>(Constants.GET_SPONSOR_PROFILES_URL, {
      withCredentials: true,
    });
  }
}
