// export interface IContent {
//     webContentId: number;
//     title: string;
//     subTitle: string;
//     body: string;
//     location: string;
//     dateAndTime: string;
//     webContentTypeId: number;

import { DateTime } from 'luxon';
import { WebContentType } from './webContentType';

// }

export class WebContent {
  public webContentId?: number;
  public companyId: number = 1;
  public contentSequence: number = 1;
  public title: string | undefined;
  public subTitle: string | undefined;
  public body: string | undefined;
  public location: string | undefined;
  public dateAndTime: string | undefined;
  public webContentTypeDescription: string | undefined;
  public expirationDate: Date = DateTime.now().toJSDate();
  public webContentTypeId!: number | null;
  public page: string = '';
  public type: string = '';
  public modifiedDate: Date = DateTime.now().toJSDate();
  public modifiedUser: number = 0;

  constructor() {}
}
