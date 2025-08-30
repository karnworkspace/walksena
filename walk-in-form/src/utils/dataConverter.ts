// Utility functions for converting between Google Sheets data and Form data

interface GoogleSheetsData {
  'No.'?: string;
  'Month'?: string;
  'Sales Queue'?: string;
  'DATE ( เข้าชมโครงการ )'?: string;
  'Lead จากเดือน ( Detail )'?: string;
  'สื่อ Online (แบบสอบถาม)'?: string;
  'สื่อ Offline'?: string;
  'Walk-in Type'?: string;
  'สื่อ pass site จากไหน'?: string;
  'Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'?: string;
  'Grade'?: string;
  'ชื่อ นามสกุล'?: string;
  'หมายเลขโทรศัพท์'?: string;
  'Email'?: string;
  'Line ID'?: string;
  'อายุ ( เลือกอายุ )'?: string;
  'เขตที่อยู่ปัจจุบัน'?: string;
  'จังหวัดที่อยู่'?: string;
  'เขตที่ทำงาน'?: string;
  'จังหวัดที่ทำงาน'?: string;
  'บริษัทที่ทำงาน'?: string;
  'ตำแหน่ง'?: string;
  'อาชีพ'?: string;
  'รายได้ต่อเดือน '?: string;
  'รายได้ต่อเดือน'?: string;
  'รูปแบบห้องที่ต้องการ '?: string;
  'งบประมาณในการซื้อ'?: string;
  'ระยะเวลาในการตัดสินใจ'?: string;
  'วัตถุประสงค์ในการซื้อ '?: string;
  'เส้นทางหลักในการเดินทางมายังโครงการ'?: string;
  'ปัจจัยที่มีผลต่อการตัดสินใจ'?: string;
  'ปัจจัยที่มีผลต่อการตัดสินใจ 2'?: string;
  'คุณมีความสนใจเรื่องใด'?: string;
  'ห้างสรรพสินค้าที่ชอปบ่อยๆ'?: string;
  'โปรโมชั่นที่สนใจ'?: string;
  'โครงการเปรียบเทียบ'?: string;
  'รายละเอียดลูกค้า'?: string;
  'รายละเอียดลูกค้า(AI)'?: string;
  'รายละเอียดลูกค้า (AI)'?: string;
  'สรุปเหตุผลลูกค้าไม่จอง'?: string;
  'เหตุผลไม่จอง'?: string;
  'วันที่ '?: string;
  'Follow'?: string;
  'Follow 2'?: string;
  [key: string]: any;
}

interface FormData {
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
  monthlyIncome?: string | number | null;

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

  // Additional fields for compatibility
  no?: number;
  month?: string;
  leadFromMonth?: string;
  mainRoute?: string;
  decisionFactors?: string;
  decisionFactors2?: string;
  comparisonProjects?: string;
  reasonNotBookingDetail?: string;
  followUpDate?: string;
  followUp?: string;
  followUp2?: string;
  [key: string]: any;
}

export function convertGoogleSheetsToFormData(sheetsData: GoogleSheetsData): FormData {
  console.log('Converting Google Sheets data:', sheetsData);
  
  // Parse date from Thai format
  const parseDate = (dateStr?: string): string | undefined => {
    if (!dateStr || dateStr.trim() === '') return undefined;
    
    try {
      // First try Thai date format dd/mm/yyyy or d/m/yyyy
      if (dateStr.includes('/')) {
        const parts = dateStr.trim().split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          let year = parseInt(parts[2]);

          // Convert Buddhist Era to Gregorian if necessary
          if (!isNaN(year) && year > 2400) {
            year = year - 543;
          }
          
          // Validate numbers
          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return undefined;
          }
          
          // Create date and validate
          const parsedDate = new Date(year, month - 1, day);
          if (parsedDate.getFullYear() === year && 
              parsedDate.getMonth() === month - 1 && 
              parsedDate.getDate() === day) {
            return parsedDate.toISOString().split('T')[0];
          }
        }
      }
      
      // Try standard date parsing
      const date = new Date(dateStr);
      if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
        return date.toISOString().split('T')[0];
      }
      
      return undefined;
    } catch (error) {
      console.warn('Date parsing error:', error, 'for date:', dateStr);
      return undefined;
    }
  };

  // Parse age number fallback
  const parseAge = (ageStr?: string): number | undefined => {
    if (!ageStr) return undefined;
    const match = ageStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : undefined;
  };

  // Split comma-separated strings into arrays
  const splitToArray = (str?: string): string[] => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  // Helper to read first available value from possible header variants
  const fromAny = (...keys: (keyof GoogleSheetsData)[]): string | undefined => {
    for (const k of keys) {
      const v = sheetsData[k];
      if (typeof v === 'string' && v.trim() !== '') return v;
    }
    return undefined;
  };

  const formData = {
    no: sheetsData['No.'] ? parseInt(sheetsData['No.']) : (sheetsData['No'] ? parseInt(sheetsData['No']) : undefined),
    month: sheetsData['Month'],
    salesQueue: sheetsData['Sales Queue'],
    // Parse visit date from sheet (Column I: DATE ( เข้าชมโครงการ ))
    visitDate: parseDate(sheetsData['DATE ( เข้าชมโครงการ )']) || null,
    leadFromMonth: sheetsData['Lead จากเดือน ( Detail )'],
    mediaOnline: sheetsData['สื่อ Online (แบบสอบถาม)'],
    mediaOffline: sheetsData['สื่อ Offline'],
    walkInType: sheetsData['Walk-in Type'],
    passSiteSource: sheetsData['สื่อ pass site จากไหน'],
    latestStatus: sheetsData['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'],
    grade: sheetsData['Grade'],
    fullName: sheetsData['ชื่อ นามสกุล'],
    phoneNumber: sheetsData['หมายเลขโทรศัพท์'],
    email: sheetsData['Email'],
    lineId: sheetsData['Line ID'],
    // Age: prefer the original range string if available; fallback to parsed number
    age: sheetsData['อายุ ( เลือกอายุ )'] && String(sheetsData['อายุ ( เลือกอายุ )']).trim() !== ''
      ? String(sheetsData['อายุ ( เลือกอายุ )']).trim()
      : parseAge(sheetsData['อายุ ( เลือกอายุ )']),
    residenceDistrict: sheetsData['เขตที่อยู่ปัจจุบัน'],
    residenceProvince: sheetsData['จังหวัดที่อยู่'],
    workDistrict: sheetsData['เขตที่ทำงาน'],
    workProvince: sheetsData['จังหวัดที่ทำงาน'],
    company: sheetsData['บริษัทที่ทำงาน'],
    position: sheetsData['ตำแหน่ง'],
    occupation: sheetsData['อาชีพ'],
    monthlyIncome: sheetsData['รายได้ต่อเดือน '] || sheetsData['รายได้ต่อเดือน'] || null,
    roomType: sheetsData['รูปแบบห้องที่ต้องการ '],
    budget: null, // Will be handled as string selection in form
    decisionTimeframe: sheetsData['ระยะเวลาในการตัดสินใจ'],
    purchasePurpose: sheetsData['วัตถุประสงค์ในการซื้อ '],
    mainRoute: sheetsData['เส้นทางหลักในการเดินทางมายังโครงการ'],
    decisionFactors: sheetsData['ปัจจัยที่มีผลต่อการตัดสินใจ'],
    decisionFactors2: sheetsData['ปัจจัยที่มีผลต่อการตัดสินใจ 2'],
    interests: splitToArray(sheetsData['คุณมีความสนใจเรื่องใด']),
    shoppingMalls: splitToArray(sheetsData['ห้างสรรพสินค้าที่ชอปบ่อยๆ']),
    promotionInterest: splitToArray(sheetsData['โปรโมชั่นที่สนใจ']),
    comparisonProjects: sheetsData['โครงการเปรียบเทียบ'],
    customerDetails: fromAny('รายละเอียดลูกค้า', 'รายละเอียดลูกค้า(AI)', 'รายละเอียดลูกค้า (AI)'),
    reasonNotBooking: sheetsData['สรุปเหตุผลลูกค้าไม่จอง'],
    reasonNotBookingDetail: sheetsData['เหตุผลไม่จอง'],
    followUpDate: parseDate(sheetsData['วันที่ ']),
    followUp: sheetsData['Follow'],
    followUp2: sheetsData['Follow 2'],
  };
  
  console.log('Converted form data:', formData);
  return formData;
}

export function convertFormDataToGoogleSheets(formData: FormData): any {
  // This function would do the reverse conversion
  // Implementation depends on your exact needs
  return formData;
}
