import { Action } from '@ngrx/store';

export enum DirectorActionTypes {
  Load = '[Director] Load',
  LoadSuccess = '[Director] Load Success',
}

export class Load implements Action {
  readonly type = DirectorActionTypes.Load;
}
export class LoadSuccess implements Action {
    readonly type = DirectorActionTypes.LoadSuccess;
    constructor(public payload: any[]) {
        // console.log(seasons);
    }
  }
  
export type DirectorActions = Load
| LoadSuccess;
