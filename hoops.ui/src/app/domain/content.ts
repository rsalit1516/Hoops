
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
    public webContentId!: number;
    public companyId!: number;
    public title!: string;
    public subTitle!: string;
    public body!: string | null;
    public location!: string;
    public dateAndTime!: string;
    public expirationDate!: Date;
    public webContentTypeId!: number;
    public contentSequence!: number;
    public webContentType!: WebContentType;
    constructor() {
    }
}
