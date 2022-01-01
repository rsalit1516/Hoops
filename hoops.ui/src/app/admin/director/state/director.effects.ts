import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
    map,
    switchMap,
    mergeMap,
    catchError,
    concatMap,
    withLatestFrom,
    tap,
    shareReplay
} from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

@Injectable()
export class DirectorEffects {

}