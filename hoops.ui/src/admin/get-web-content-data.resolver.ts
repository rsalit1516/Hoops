import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService } from './web-content/content.service';

@Injectable({
  providedIn: 'root',
})
export class getWebContentDataResolver implements Resolve<any> {
  contentService = inject(ContentService);

  constructor() {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.contentService.getContents();
  }
}
