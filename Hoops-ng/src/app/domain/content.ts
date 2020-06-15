
// export interface IContent {
//     webContentId: number;
//     title: string;
//     subTitle: string;
//     body: string;
//     location: string;
//     dateAndTime: string;
//     webContentTypeId: number;

import { WebContentType } from './webContentType';

// }

export class Content {
    public webContentId: number;
    public companyId: number = 1;
    public title: string;
    public subTitle: string;
    public body: string;
    public location: string;
    public dateAndTime: string;
    public expirationDate: Date;
    public webContentTypeId: number =1;
    public contentSequence: number = 1;
    public webContentType: WebContentType;
    constructor() {
    }
}
