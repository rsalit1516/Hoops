import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

// import * as fromapp from './';
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
import { HttpClient } from '@angular/common/http';
import { DataService } from 'app/services/data.service';

@Injectable()
export class AppEffects {
}
