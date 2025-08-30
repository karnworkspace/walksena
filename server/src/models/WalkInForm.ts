
export interface WalkInFormData {
  no?: number;                          // Column A
  month?: string;                       // Column B  
  salesQueue?: string;                   // Column C
  visitDate?: string;                      // Column D
  leadFromMonth?: string;               // Column E
  mediaOnline?: string;                 // Column F
  mediaOffline?: string;                // Column G
  walkInType?: string;                   // Column H
  passSiteSource?: string;              // Column I
  latestStatus?: string;                // Column J
  grade?: string;                        // Column K
  
  fullName?: string;                     // Column L
  phoneNumber?: string;                  // Column M
  email?: string;                       // Column N
  lineId?: string;                      // Column O
  age?: number;                         // Column P
  
  residenceDistrict?: string;           // Column Q
  residenceProvince?: string;           // Column R
  workDistrict?: string;                // Column S
  workProvince?: string;                // Column T
  
  company?: string;                     // Column U
  position?: string;                  // Column V
  occupation?: string;                // Column W
  monthlyIncome?: string | number;      // Column X (range string or numeric)
  
  roomType?: string;                    // Column Y
  budget?: number;                      // Column Z
  decisionTimeframe?: string;         // Column AA
  purchasePurpose?: string;             // Column AB
  
  mainRoute?: string;                   // Column AC
  decisionFactors?: string;            // Column AD
  decisionFactors2?: string;            // Column AE
  interests?: string[];                 // Column AF
  shoppingMalls?: string;               // Column AG
  promotionInterest?: string;           // Column AH
  
  comparisonProjects?: string;          // Column AI
  customerDetails?: string;           // Column AJ
  reasonNotBooking?: string;            // Column AK
  reasonNotBookingDetail?: string;      // Column AL

  followUps?: { date: string | null; detail: string }[]; // Column AM, AN, AO...
  
  // Additional fields for draft functionality
  isDraft?: boolean;
  completedSteps?: number;
  lastUpdated?: string;
}
