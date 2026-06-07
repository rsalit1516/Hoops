export class Color {
  public colorId!: number;
  public colorName!: string;
  public createdDate: Date | string | null = null;
  public createdUser: number | null = null;
  public modifiedDate: Date | string | null = null;
  public modifiedUser: number | null = null;
}
