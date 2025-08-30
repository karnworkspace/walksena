
// Based on developer_specification.md

export interface WalkInFormData {
  // Meta
  no?: number | null;
  // Step 1
  visitDate?: string | null;
  salesQueue?: string;
  walkInType?: string;
  mediaOnline?: string;
  mediaOffline?: string;
  passSiteSource?: string;

  // Step 2
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  lineId?: string;
  age?: string | number | null;

  // Step 3
  residenceDistrict?: string;
  residenceProvince?: string;
  workDistrict?: string;
  workProvince?: string;
  company?: string;
  position?: string;
  occupation?: string;
  monthlyIncome?: number | null;

  // Step 4
  roomType?: string;
  budget?: number | null;
  decisionTimeframe?: string;
  purchasePurpose?: string;
  interests?: string[];
  shoppingMalls?: string[];
  promotionInterest?: string[];

  // Step 5
  grade?: string;
  latestStatus?: string;
  customerDetails?: string;
  reasonNotBooking?: string;
  followUps?: { date: string | null; detail: string }[];
}
