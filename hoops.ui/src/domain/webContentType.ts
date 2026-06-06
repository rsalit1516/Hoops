export class WebContentType {
    public webContentTypeId!: number;
    public webContentTypeDescription!: string;
    public createdDate?: Date | string | null;
    public createdUser?: number | null;
    public modifiedDate?: Date | string | null;
    public modifiedUser?: number | null;
    constructor() {}
}
