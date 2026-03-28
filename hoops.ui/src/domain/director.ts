export class Director {
  directorId!: number;
  companyId?: number;
  personId!: number;
  seq?: number;
  title!: string;
  name?: string; // From VwDirector, not in base Director model
  firstName?: string;
  lastName?: string;
  phone?: string;
  cellPhone?: string;
  workPhone?: string;
  email?: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  phonePref?: string;
  emailPref?: number;
  createdDate?: Date;
  createdUser?: string;
  photo?: any;
  constructor(
    directorId: number,
    name: string,
    companyId: number,
    personId: number,
    seq: number,
    title: string
  ) {}
}

// Interface for director list display
export interface DirectorListItem {
  id: number; // For BaseList compatibility
  directorId: number;
  name: string;
  title: string;
  seq: number;
}
