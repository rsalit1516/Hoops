import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';
import { Constants } from '@app/shared/constants';
import { setErrorMessage } from '@app/shared/error-message';
import { map, Observable, tap } from 'rxjs';
import { PeopleService } from './people.service';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {
  // Injected services
  private http = inject(HttpClient);
  #peopleService = inject(PeopleService);

  inithUrl = Constants.SEARCH_HOUSEHOLD_URL;
  searchUrl = '';
  selectedCriteria = signal<householdSearchCriteria>({
    householdName: '',
    address: '',
    email: '',
    phone: ''
  });
  // Signal to support the template
  criteria = linkedSignal<householdSearchCriteria>(() => this.selectedCriteria());

  householdSearchResults = signal<Household[]>([]);
  error = computed(() => this.householdResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Household'));
  // isLoading = this.householdResource.isLoading;
  selectedHouseholdSignal = signal<Household | null>(null);

  private _selectedHousehold = signal<Household | null>(null);

  // Expose the selected record signal
  selectedRecordSignal = this._selectedHousehold.asReadonly();
  householdSaved = signal<boolean>(false);

  constructor () {
    // Optional: Effect for side effects when the signal changes
    effect(() => {
      const record = this._selectedHousehold();
      console.log('Selected record changed:', record);
      if (record !== null) {
        console.log(`Record updated: ${ record.name }`);
        // Optionally trigger additional logic here
      }
    });
    effect(() => {
      console.log(this.householdSaved());
    });
  }

  // Method to update the selected record ID
  updateSelectedHousehold (record: Household) {
    this._selectedHousehold.set(record);
    this.getHouseholdMembers();
  }

  get selectedHousehold () {
    return this._selectedHousehold();
  }

  executeSearch () {
    this.searchUrl = this.constructQueryString(this.selectedCriteria());
    this.searchHouseholds$().subscribe(response => {
      this.householdSearchResults.set(response!);
      console.log(this.results);
      //       console.log('Household data: ', this.householdsResult());
    });
  }

  getHouseholdMembers () {
    this.#peopleService.getHouseholdMembers(this.selectedRecordSignal()!.houseId);
  }

  // To generate an error, add characters to the URL
  private householdResource = rxResource({
    loader: () => this.http.get<HouseholdResponse>(this.searchUrl, { responseType: 'json' })
      .pipe(
        map(vr => vr.results),
        tap(vr => console.log(vr))
      )
  });

  private searchHouseholds$ (): Observable<Household[] | undefined> {
    return this.http.get<Household[]>(this.searchUrl, { responseType: 'json' });
  }
  searchHouseholds (): Signal<Household[] | undefined> {
    return toSignal(this.searchHouseholds$());
  }

  getResults (criteria: householdSearchCriteria): Observable<Household[] | undefined> {
    this.searchUrl = this.constructQueryString(criteria);
    return this.searchHouseholds$();
  }

  get results () {
    return this.householdSearchResults();
  }

  fetchFilteredData (filters: any): Observable<any[]> {
    console.log(filters);
    const filterObject: householdSearchCriteria = {
      householdName: filters.householdName,
      address: filters.address,
      email: filters.email,
      phone: filters.phone
    };
    this.searchUrl = this.constructQueryString(filterObject);
    console.log('Query String: ', this.searchUrl);
    return this.http.get<Household[]>(this.searchUrl, { responseType: 'json' });
  }

  constructQueryString (criteria: householdSearchCriteria): string {
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
    // console.log('Search URL: ', url);
    return url;
    // add additional criteria as needed
    // https://localhost:5001/api/Household/search?name=salit&email=richard.salit%40gmail.com
  }
  saveHousehold (household: Household): void {
    if (household.houseId !== 0) {
      const url = Constants.SAVE_HOUSEHOLD_URL + household.houseId;
      console.log('URL: ', url);
      this.http.put<Household>(url, household).subscribe(response => {
        console.log('Household updated:', response);
      });
    } else {
      console.log('New household');
      this.http.post<Household>(Constants.SAVE_HOUSEHOLD_URL, household).subscribe(response => {
        console.log('Household created:', response);
      });
    }
  }
  newHousehold () {
    const household = new Household();
    this._selectedHousehold.set(household);
  }
  selectedHouseholdByHouseId(houseId: number) {
    this.http.get<Household>(Constants.GET_HOUSEHOLD_BY_ID_URL + '/' + houseId.toString(), { responseType: 'json' }).subscribe(response => {
      this.updateSelectedHousehold(response);
    });
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
