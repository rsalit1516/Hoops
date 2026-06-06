export class Location {
  public locationNumber!: number;
  public locationName!: string;
  public notes!: string;
  public createdDate?: Date | string | null;
  public createdUser?: number | null;
  public modifiedDate?: Date | string | null;
  public modifiedUser?: number | null;
}
