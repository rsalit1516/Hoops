
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

export class WebContent {
    public webContentId: number;
    public contentSequence: number = 1;
    public title: string;
    public subTitle: string;
    public body: string;
    public location: string;
    public dateAndTime: string;
    public webContentTypeDescription: string;
    constructor() {
    }
}
