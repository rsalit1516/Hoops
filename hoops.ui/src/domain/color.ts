export class Color {
  public colorId!: number;
  public companyId: number = 1;
  public colorName!: string;
  public discontinued: boolean | null = null;
  public createdDate: Date | string | null = null;
  public createdUser: number | null = null;
  public modifiedDate: Date | string | null = null;
  public modifiedUser: number | null = null;
}
