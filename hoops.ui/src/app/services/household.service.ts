import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Household } from '@app/domain/household';
import { Constants } from '@app/shared/constants';
import { setErrorMessage } from '@app/shared/error-message';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  // Injected services
  private http = inject(HttpClient);

  inithUrl = Constants.searchHouseholdUrl;
  searchUrl = '';

  criteria: householdSearchCriteria = {

    householdName: '',
    address: '',
    email: '',
    phone: ''
  }

  // To generate an error, add characters to the URL
  householdResource = rxResource({
    loader: () => this.http.get<HouseholdResponse>(this.searchUrl)
      .pipe(
      map(vr => vr.results)
    )
  });

  executeSearch() {
    this.householdResource.reload();
  }

  households = computed(() => this.householdResource.value() ?? [] as Household[]);
  error = computed(() => this.householdResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Vehicle'));
  isLoading = this.householdResource.isLoading;

  constructor() { }

  query() { }

  constructQueryString(criteria: householdSearchCriteria): string {
    let url = this.inithUrl;

    if (criteria == null) {
      return '';
    }
    if (criteria.householdName !== '') {
      url += '?name=' + criteria.householdName;
    }
    if (criteria.email !== '') {
      if (url.indexOf('?') === -1) {
        url += '?email=' + criteria.email;
      } else {
        url += '&email=' + criteria.email;
      }
    }
    this.searchUrl = url;
    return url;
    // add additional criteria as needed
    // https://localhost:5001/api/Household/search?name=salit&email=richard.salit%40gmail.com
  }
}
export interface householdSearchCriteria {
  householdName: string;
  address: string;
  email: string;
  phone: string;
}
export interface HouseholdResponse {
  count: number;
  next: string;
  previous: string;
  results: Household[];
}
