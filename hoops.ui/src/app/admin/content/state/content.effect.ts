import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as contentActions from './content.actions';
import * as fromContent from './';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ContentService } from '../content.service';

@Injectable()
export class ContentEffects {
  index!: number;

  constructor(
    private actions$: Actions,
    private contentService: ContentService,
    private store: Store<fromContent.State>
  ) {}

  public loadContent$ = this.loadContent();
  public loadActiveContent$ = this.loadActiveContent();
  public loadAllContent$ = this.loadAllContent();

  // tslint:disable-next-line:member-ordering
  private loadContent() {
    return createEffect(() => this.actions$.pipe(
      ofType(contentActions.ContentActionTypes.LoadAdminContent),
      mergeMap(action =>
        this.contentService.getContents().pipe(
          map(content => new contentActions.LoadAdminContentSuccess(content)),
          // tap(content => console.log(content)),
          catchError(err => of(new contentActions.LoadAdminContentFail(err)))
        )
      )
    ));
  }

  private loadActiveContent() {
    return createEffect(() => this.actions$.pipe(
      ofType(contentActions.ContentActionTypes.SetActiveContent),
      switchMap(action =>
        this.contentService.getActiveContents().pipe(
          map(content => new contentActions.SetActiveContentSuccess(content)),
          tap(response => console.log(response)),
          catchError(err => of(new contentActions.SetActiveContentFail(err)))
        )
      )
    ));
  }
  private loadAllContent() {
    return createEffect(() => this.actions$.pipe(
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
}
