import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as homeActions from './home.actions';
import * as fromHome from './';

import {
  map,
  switchMap,
  mergeMap,
  catchError,
  concatMap,
  withLatestFrom,
  tap,
  shareReplay,
} from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
// import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { Content } from 'app/domain/content';
import { HttpClient } from '@angular/common/http';
import { WebContent } from 'app/domain/webContent';

@Injectable()
export class HomeEffects {
  seasonId: number | undefined;
  gameUrl: string | undefined;
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    //    private contentService: ContentService,
    private dataService: DataService,
    private store: Store<fromHome.State>
  ) {}
  // tslint:disable-next-line:member-ordering

  loadContent$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.LoadContent),
    mergeMap(action =>
      this.http.get<WebContent[]>(this.dataService.getActiveWebContentUrl).pipe(
        map(content => new homeActions.LoadContentSuccess(content)),
        // tap(content => console.log(content)),
        catchError((err) => of(new homeActions.LoadContentFail(err)))
      )
    )
  ));
}
