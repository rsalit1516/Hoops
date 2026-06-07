export interface SponsorProfile {
  sponsorProfileId: number;
  companyId: number;
  createdDate?: Date | string | null;
  createdUser?: number | null;
  modifiedDate?: Date | string | null;
  modifiedUser?: number | null;
  houseId: number | null;
  spoName: string;
  contactName: string;
  email: string;
  phone: string;
  url: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  typeOfBuss: string;
  showAd: boolean;
  adExpiration: Date | string | null;
}

export interface SponsorSeason {
  sponsorId: number;
  sponsorProfileId: number;
  seasonId: number | null;
  seasonDescription: string;
  shirtName: string;
  shirtSize: string;
  spoAmount: number | null;
  feeId: number | null;
  mailCheck: boolean | null;
  adExpiration: Date | string | null;
}

export interface SponsorPayment {
  paymentId: number;
  sponsorProfileId: number;
  createdDate?: Date | string | null;
  createdUser?: number | null;
  modifiedDate?: Date | string | null;
  modifiedUser?: number | null;
  amount: number;
  paymentType: string;
  transactionDate: Date | string | null;
  transactionNumber: string;
  memo: string;
}

export interface SponsorFee {
  sponsorFeeId: number;
  feeName: string;
  amount: number;
}

export interface SponsorListItem {
  id: number;
  sponsorProfileId: number;
  spoName: string;
  contactName: string;
  email: string;
  phone: string;
  lastSeasonId: number | null;
  lastSeasonDescription: string | null;
}
