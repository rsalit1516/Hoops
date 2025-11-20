export class Household {
  public houseId: number = 0;
  public name!: string;
  public address1?: string;
  public address2?: string;
  public city?: string;
  public state?: string = 'FL';
  public zip?: string;
  public email?: string;
  public phone?: string;
}

// Interface for household list display
export interface HouseholdListItem {
  id: number; // For BaseList compatibility
  houseId: number;
  name: string;
  address1?: string;
  phone?: string;
  email?: string;
}
