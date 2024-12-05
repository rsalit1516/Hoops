import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// import { DataService } from './data.service'; // Replace with your actual data service
import { Store } from '@ngrx/store';
import * as contentActions from './state/admin.actions';
import * as fromContent from './state';
import { ContentService } from './web-content/content.service';

@Injectable({
  providedIn: 'root',
})
export class getWebContentDataResolver implements Resolve<any> {
  contentService = inject(ContentService);
  constructor (private store: Store<fromContent.State>) {}

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.contentService.getContents();
  }
}

