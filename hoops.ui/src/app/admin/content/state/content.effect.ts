import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { WebContent } from '../../../domain/webContent';

@Injectable()
export class ContentEffects {
  index!: number;

  constructor(
    private actions$: Actions,
    private contentService: ContentService,
    private store: Store<fromContent.State>
  ) {}

  // tslint:disable-next-line:member-ordering
  loadContent$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(contentActions.ContentActionTypes.Load),
    mergeMap(action =>
      this.contentService.getContents().pipe(
        map(content => new contentActions.LoadSuccess(content)),
        // tap(content => console.log(content)),
        catchError(err => of(new contentActions.LoadFail(err)))
      )
    )
  ));


  loadActiveContent$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(contentActions.ContentActionTypes.SetActiveContent),
    switchMap(action =>
      this.contentService.getActiveContents().pipe(
        map(content => new contentActions.SetActiveContentSuccess(content)),
        tap(response => console.log(response)),
        catchError(err => of(new contentActions.SetActiveContentFail(err)))
      )
    )
  ));

  loadAllContent$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(contentActions.ContentActionTypes.SetAllContent),
    switchMap(action =>
      this.contentService.getAllContents().pipe(
        map(content => new contentActions.SetAllContentSuccess(content)),
        tap(response => console.log(response)),
        catchError(err => of(new contentActions.SetAllContentFail(err)))
      )
    )
  ));
}
