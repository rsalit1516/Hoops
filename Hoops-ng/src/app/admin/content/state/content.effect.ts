import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as contentActions from './content.actions';
import * as fromContent from './';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap,
  mapTo,
  withLatestFrom,
  exhaustMap,
  concatMap,
  shareReplay
} from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ContentService } from '../content.service';

@Injectable()
export class ContentEffects {
  index: number;

  constructor(
    private actions$: Actions,
    private contentService: ContentService,
    private store: Store<fromContent.State>
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect()
  loadContent$: Observable<Action> = this.actions$.pipe(
    ofType(contentActions.ContentActionTypes.Load),
    mergeMap(action =>
      this.contentService.content$.pipe(
        map(content => new contentActions.LoadSuccess(content)),
        tap(content => console.log(content)),
        catchError(err => of(new contentActions.LoadFail(err)))
      )
    )
  );

  @Effect()
  loadActiveContent$: Observable<Action> = this.actions$.pipe(
    ofType(contentActions.ContentActionTypes.SetActiveContent),
    switchMap(action =>
      this.contentService.getActiveContents().pipe(
        map(content => new contentActions.SetActiveContentSuccess(content)),
        tap(response => console.log(response)),
        catchError(err => of(new contentActions.SetActiveContentFail(err)))
      )
    )
  );
  @Effect()
  loadAllContent$: Observable<Action> = this.actions$.pipe(
    ofType(contentActions.ContentActionTypes.SetAllContent),
    switchMap(action =>
      this.contentService.getAllContents().pipe(
        map(content => new contentActions.SetAllContentSuccess(content)),
        tap(response => console.log(response)),
        catchError(err => of(new contentActions.SetAllContentFail(err)))
      )
    )
  );
}
