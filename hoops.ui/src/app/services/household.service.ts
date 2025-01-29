import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Household } from '@app/domain/household';
import { Constants } from '@app/shared/constants';
import { setErrorMessage } from '@app/shared/error-message';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  // Injected services
  private http = inject(HttpClient);

  inithUrl = Constants.searchHouseholdUrl;
  searchUrl = '';
  selectedCriteria = signal<householdSearchCriteria>({
    householdName: '',
    address: '',
    email: '',
    phone: ''
  });
  // Signal to support the template
  criteria = linkedSignal<householdSearchCriteria>(() => this.selectedCriteria());

  householdsResult = signal<Household[]>([]);
  error = computed(() => this.householdResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Household'));
  // isLoading = this.householdResource.isLoading;
  selectedHouseholdSignal = signal<Household | null>(null);

  private selectedRecord = signal<Household | null>(null);

  // Expose the selected record signal
  selectedRecordSignal = this.selectedRecord.asReadonly();

  constructor() {
    // Optional: Effect for side effects when the signal changes
    effect(() => {
      const record = this.selectedRecord();
      console.log('Selected record changed:', record);
      if (record !== null) {
        console.log(`Record updated: ${record.name}`);
        // Optionally trigger additional logic here
      }
    });
  }

  // Method to update the selected record ID
  updateSelectedRecord(record: Household) {
    this.selectedRecord.set(record);
  }

  get selectedHousehold() {
    return this.selectedHouseholdSignal();
  }

  executeSearch() {
    this.searchUrl = this.constructQueryString(this.selectedCriteria());
    // this.householdResource.reload();
    this.searchHouseholds$().subscribe(response => {
      // const hh1 = response;
      // console.log(hh1);
      // let hh2: Household[] = [];
      // if (hh1) {
      //   hh1.forEach(element => {
      //     hh2.push(element);
      //   });
      //   let counter = 0;
      this.householdsResult.set(response!);
      console.log(this.results);
      //       console.log('Household data: ', this.householdsResult());
    });
  }

  // To generate an error, add characters to the URL
  private householdResource = rxResource({
    loader: () => this.http.get<HouseholdResponse>(this.searchUrl, { responseType: 'json' })
      .pipe(
        map(vr => vr.results),
        tap(vr => console.log(vr))
      )
  });

  private searchHouseholds$(): Observable<Household[] | undefined> {
    return this.http.get<Household[]>(this.searchUrl, { responseType: 'json' });
  }
  searchHouseholds(): Signal<Household[] | undefined> {
    return toSignal(this.searchHouseholds$());
  }
  getResults(criteria: householdSearchCriteria): Observable<Household[] | undefined> {
    this.searchUrl = this.constructQueryString(criteria);
    return this.searchHouseholds$();
  }
  get results() {
    return this.householdsResult();
  }

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
    // console.log('Search URL: ', url);
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
