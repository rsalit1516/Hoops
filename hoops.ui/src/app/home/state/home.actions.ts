import { Sponsor } from '@app/domain/sponsor';
import { Action } from '@ngrx/store';
import { WebContent } from '../../domain/webContent';

export enum HomeActionTypes {
  LoadContent = '[Home] Load Content',
  LoadContentSuccess = '[Home] Load Content Success',
  LoadContentFail = '[Home] Load Content Fail',
  LoadSponsors = '[Home] Load Sponsors',
  LoadSponsorsSuccess = '[Home] LoadSponsors Success',
  LoadSponsorsFail = '[Home] LoadSponsors Fail',
}

export class LoadContent implements Action {
  readonly type = HomeActionTypes.LoadContent;
}
export class LoadContentSuccess implements Action {
  readonly type = HomeActionTypes.LoadContentSuccess;
  constructor(public payload: WebContent[]) {
  }
}

export class LoadContentFail implements Action {
  readonly type = HomeActionTypes.LoadContentFail;
  constructor(public payload: string) {}
}

export class LoadSponsors implements Action {
  readonly type = HomeActionTypes.LoadSponsors;
}
export class LoadSponsorsSuccess implements Action {
  readonly type = HomeActionTypes.LoadSponsorsSuccess;
  constructor(public payload: Sponsor[]) {
  }
}

export class LoadSponsorsFail implements Action {
  readonly type = HomeActionTypes.LoadSponsorsFail;
  constructor(public payload: string) {}
}

export type HomeActions =
| LoadContent
| LoadContentSuccess
| LoadContentFail
| LoadSponsors
| LoadSponsorsSuccess
| LoadSponsorsFail;
