import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import * as homeActions from './home.actions';
import * as fromHome from './';
import * as fromGames from '../../games/state';

import {
  map,
  mergeMap,
  catchError,
  exhaustMap,
} from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
// import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { HttpClient } from '@angular/common/http';
import { WebContent } from '@app/domain/webContent';
import { Sponsor } from '@app/domain/sponsor';
import { Constants } from '@app/shared/constants';
import { SeasonService } from '@app/services/season.service';

@Injectable()
export class HomeEffects {
  readonly #seasonService = inject(SeasonService);
  readonly #http = inject(HttpClient);
  readonly #dataService = inject(DataService);

  seasonId: number | undefined;
  gameUrl: string | undefined;

  constructor (
    private actions$: Actions,
    //    private contentService: ContentService,
    private store: Store<fromHome.State>
  ) { }
  // tslint:disable-next-line:member-ordering

  loadContent$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.LoadContent),
    mergeMap(action =>
      this.#http.get<WebContent[]>(this.#dataService.getActiveWebContentUrl).pipe(
        map(content => new homeActions.LoadContentSuccess(content)),
        // tap(content => console.log(content)),
        catchError((err) => of(new homeActions.LoadContentFail(err)))
      )
    )
  ));

  loadSponsors$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.LoadSponsors),
    concatLatestFrom(() => this.store.select(fromGames.getCurrentSeason)),
    exhaustMap(([, currentSeason]) => {
      // const season = currentSeason;
      // const id = currentSeason?.seasonId;
      return this.#http.get<Sponsor[]>(Constants.GET_SEASON_SPONSORS + '?seasonId=' + this.#seasonService.currentSeason()!.seasonId).pipe(
        map(sponsors => new homeActions.LoadSponsorsSuccess(sponsors)),
        catchError((err) => of(new homeActions.LoadSponsorsFail(err)))
      );
    }
    )
  ));

}

