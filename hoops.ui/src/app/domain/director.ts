export class Director {
  id!: number;
  companyId!: number;
  peopleId!: number;
  seq!: number;
  title!: string;
  name!: string;
  createdDate!: Date;
  createdUser: string | undefined;
  constructor(
    id: number,
    name: string,
    companyId: number,
    peopleId: number,
    seq: number,
    title: string
  ) {}
}
