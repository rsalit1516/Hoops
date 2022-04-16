/* NgRx */
import { Action } from '@ngrx/store';
import { Content } from 'app/domain/content';
import { WebContentType } from 'app/domain/webContentType';
import { WebContent } from '../../../domain/webContent';

export enum ContentActionTypes {
  Load = '[Content] Load',
  LoadSuccess = '[Content] Load Success',
  LoadFail = '[Content] Load Fail',
  SetSelectedContent = '[Content] Set Selected Content',
  SetAllContent = '[Content] Show all content',
  SetAllContentSuccess = '[Content] Show all content success',
  SetAllContentFail = '[Content] Show all content faile',
  SetActiveContent = '[Content] Show only active content',
  SetActiveContentSuccess = '[Content] Show only active content success',
  SetActiveContentFail = '[Content] Show only active content fail',
  SetIsActiveOnly = '[Content] Set Is Active Content Only',
  LoadContentTypeList = '[Content] Load Content Type List',
  LoadContentTypeListSuccess = '[Content] Load Content Type List Success',
  LoadContentTypeListFail = '[Content] Load Content Type List Fail',
}

export class Load implements Action {
  readonly type = ContentActionTypes.Load;
}
export class LoadSuccess implements Action {
  readonly type = ContentActionTypes.LoadSuccess;
  constructor(public payload: WebContent[]) {}
}
export class LoadFail implements Action {
  readonly type = ContentActionTypes.LoadFail;
  constructor(public payload: string) {}
}

export class SetAllContent implements Action {
  readonly type = ContentActionTypes.SetAllContent;
}
export class SetAllContentSuccess implements Action {
  readonly type = ContentActionTypes.SetAllContentSuccess;
  constructor(public payload: WebContent[]) {}
}
export class SetAllContentFail implements Action {
  readonly type = ContentActionTypes.SetAllContentFail;
  constructor(public payload: String) {}
}

export class SetActiveContent implements Action {
  readonly type = ContentActionTypes.SetActiveContent;
}
export class SetActiveContentSuccess implements Action {
  readonly type = ContentActionTypes.SetActiveContentSuccess;
  constructor(public payload: WebContent[]) {}
}
export class SetActiveContentFail implements Action {
  readonly type = ContentActionTypes.SetActiveContentFail;
  constructor(public payload: String) {}
}

export class SetSelectedContent implements Action {
  readonly type = ContentActionTypes.SetSelectedContent;
  constructor(public payload: Content) {}
}
export class SetIsActiveOnly implements Action {
  readonly type = ContentActionTypes.SetIsActiveOnly;
  constructor(public payload: boolean) {}
}
export class LoadContentTypeList implements Action {
  readonly type = ContentActionTypes.LoadContentTypeList;
}
export class LoadContentTypeListSuccess implements Action {
  readonly type = ContentActionTypes.LoadContentTypeListSuccess;
  constructor(public payload: WebContentType[]) {}
}
export class LoadContentTypeListFail implements Action {
  readonly type = ContentActionTypes.LoadContentTypeListFail;
  constructor(public payload: string) {}
}

export type ContentActions =
  | Load
  | LoadSuccess
  | LoadFail
  | SetSelectedContent
  | SetAllContent
  | SetAllContentSuccess
  | SetAllContentFail
  | SetActiveContent
  | SetActiveContentSuccess
  | SetActiveContentFail
  | SetIsActiveOnly
  | LoadContentTypeList
  | LoadContentTypeListSuccess
  | LoadContentTypeListFail
