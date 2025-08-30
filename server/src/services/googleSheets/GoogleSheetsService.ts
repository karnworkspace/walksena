
import { sheets_v4 } from 'googleapis';
import { sheets, GOOGLE_CONFIG } from '../../config/google';
import { WalkInFormData } from '../../models/WalkInForm';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;

  constructor() {
    this.sheets = sheets;
  }

  async appendWalkInData(data: WalkInFormData): Promise<{ success: boolean; rowNumber?: number; error?: string }> {
    try {
      console.log('📝 Appending data to Google Sheets...');
      
      // Get next running number
      const runningNumber = await this.getNextRunningNumber();
      
      // Map form data to sheet columns (A-CF = 84 columns)
      const values = this.mapDataToSheetRow(data);
      
      // Set running number in both Column A (index 0) and Column F (index 5)
      // Some sheets reference A as RowId, while operational No. is kept in F
      values[0] = runningNumber;
      values[5] = runningNumber;
      
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A:CF`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values]
        }
      });

      console.log('✅ Data appended successfully');
      console.log('   Range:', response.data.updates?.updatedRange);
      console.log('   Running Number:', runningNumber);
      
      // Extract row number from range (e.g., "'Walk-in 2025'!A2:CF2" -> 2)
      const rowNumber = response.data.updates?.updatedRange?.match(/(\d+)$/)?.[1];
      
      return {
        success: true,
        rowNumber: rowNumber ? parseInt(rowNumber) : undefined
      };

    } catch (error) {
      console.error('❌ Failed to append data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkExistingCustomer(phoneNumber: string): Promise<{ exists: boolean; data?: any }> {
    try {
      console.log('🔍 Checking for existing customer:', phoneNumber);

      // Read all data from the sheet
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A:CF`
      });

      const rows = response.data.values || [];
      
      // Skip header row, check column R (index 17) for phone numbers  
      // Note: Phone number is now in column R (index 17)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const existingPhone = row[17]; // Column R = phone number
        
        if (existingPhone && this.normalizePhoneNumber(existingPhone) === this.normalizePhoneNumber(phoneNumber)) {
          console.log('✅ Found existing customer at row:', i + 1);
          
          return {
            exists: true,
            data: {
              rowNumber: i + 1,
              runningNumber: row[5] ?? row[0],    // Prefer Column F; fallback Column A
              fullName: row[16],        // Column Q = full name
              phoneNumber: row[17],     // Column R = phone number
              email: row[18],           // Column S = email
              lineId: row[19],          // Column T = Line ID
              age: row[20],             // Column U = age
              // Add more fields as needed
            }
          };
        }
      }

      console.log('ℹ️  No existing customer found');
      return { exists: false };

    } catch (error) {
      console.error('❌ Failed to check existing customer:', error);
      return { exists: false };
    }
  }

  async getAllWalkInData(): Promise<any[]> {
    try {
      console.log('Fetching all data from Google Sheets...');
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A:CF`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      const header = rows[0];
      const data = rows.slice(1).map(row => {
        const rowData: any = {};
        header.forEach((key, index) => {
          rowData[key] = row[index];
        });
        return rowData;
      });

      return data;
    } catch (error) {
      console.error('Failed to fetch all data:', error);
      throw error;
    }
  }

  async updateByRunningNumber(no: number, data: WalkInFormData): Promise<{ success: boolean; rowNumber?: number; error?: string }> {
    try {
      // Fetch rows to find the row index for given running number
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A:CF`,
      });

      const rows = response.data.values || [];
      let targetRowIndex = -1; // 0-based including header

      for (let i = 1; i < rows.length; i++) { // skip header row
        const rowNo = rows[i][5] ?? rows[i][0];
        if (rowNo && Number(rowNo) === Number(no)) {
          targetRowIndex = i; // 0-based
          break;
        }
      }

      if (targetRowIndex === -1) {
        return { success: false, error: `Running number ${no} not found` };
      }

      const rowNumber = targetRowIndex + 1; // 1-based for sheet
      const values = this.mapDataToSheetRow({ ...data, no });
      // Keep running number consistent in both A and F
      values[0] = no;
      values[5] = no;

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A${rowNumber}:CF${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values]
        }
      });

      return { success: true, rowNumber };

    } catch (error) {
      console.error('❌ Failed to update row:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUniqueValues(columnIndex: number, maxRows: number = 100): Promise<string[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A:CF`
      });

      const rows = response.data.values || [];
      const uniqueValues = new Set<string>();

      // Skip header row and collect unique values
      for (let i = 1; i < Math.min(rows.length, maxRows + 1); i++) {
        const value = rows[i][columnIndex];
        if (value && typeof value === 'string' && value.trim() !== '') {
          uniqueValues.add(value.trim());
        }
      }

      return Array.from(uniqueValues).sort();

    } catch (error) {
      console.error('❌ Failed to get unique values:', error);
      return [];
    }
  }

  private mapDataToSheetRow(data: WalkInFormData): any[] {
    const row = new Array(84).fill(''); // 84 columns (A-CF)

    // Column A = running number (will be set in appendWalkInData)
    // Columns B-G = empty/reserved  
    // Map data starting from Column H (index 7)
    row[7] = data.salesQueue || '';                   // Column H: Sales Queue
    row[8] = this.formatDate(data.visitDate) || '';   // Column I: DATE (วันที่เข้าโครงการ)
    row[9] = data.leadFromMonth || '';                // Column J: Lead จากเดือน (Detail)
    row[10] = data.mediaOnline || '';                 // Column K: สื่อ Online (ขนุมอมุมา)
    row[11] = data.mediaOffline || '';                // Column L: สื่อ Offline
    row[12] = data.walkInType || '';                  // Column M: Walk-in Type
    row[13] = data.passSiteSource || '';              // Column N: สื่อ pass site อะไรบ้าง
    row[14] = data.latestStatus || '';                // Column O: Status สุดท้าย (unqualified/qualified)
    row[15] = data.grade || '';                       // Column P: Grade
    row[16] = data.fullName || '';                    // Column Q: ชื่อลูกค้า
    row[17] = data.phoneNumber || '';                 // Column R: เบอร์โทร
    row[18] = data.email || '';                       // Column S: อีเมล
    row[19] = data.lineId || '';                      // Column T: Line ID
    row[20] = data.age || '';                         // Column U: อายุ
    row[21] = data.residenceDistrict || '';           // Column V
    row[22] = data.residenceProvince || '';           // Column W
    row[23] = data.workDistrict || '';                // Column X
    row[24] = data.workProvince || '';                // Column Y
    row[25] = data.company || '';                     // Column Z
    row[26] = data.position || '';                    // Column AA
    row[27] = data.occupation || '';                  // Column AB
    row[28] = data.monthlyIncome || '';               // Column AC
    row[29] = data.roomType || '';                    // Column AD
    row[30] = data.budget || '';                      // Column AE
    row[31] = data.decisionTimeframe || '';           // Column AF
    row[32] = data.purchasePurpose || '';             // Column AG
    row[33] = data.mainRoute || '';                   // Column AH
    row[34] = data.decisionFactors || '';             // Column AI
    row[35] = data.decisionFactors2 || '';            // Column AJ
    
    // Convert arrays to comma-separated strings for Google Sheets compatibility
    row[36] = Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || '');  // Column AK
    row[37] = Array.isArray(data.shoppingMalls) ? data.shoppingMalls.join(', ') : (data.shoppingMalls || '');  // Column AL
    row[38] = Array.isArray(data.promotionInterest) ? data.promotionInterest.join(', ') : (data.promotionInterest || '');  // Column AM
    row[39] = data.comparisonProjects || '';          // Column AN
    row[40] = data.customerDetails || '';             // Column AO
    row[41] = data.reasonNotBooking || '';            // Column AP
    row[42] = data.reasonNotBookingDetail || '';      // Column AQ

    // Follow-ups (max 2): AT (index 45), AU (index 46)
    if (data.followUps && data.followUps.length > 0) {
      const f1 = data.followUps[0];
      if (f1) {
        const date = f1.date ? this.formatDate(f1.date) : '';
        row[45] = `${date}${date ? ': ' : ''}${f1.detail || ''}`; // Column AT
      }
      const f2 = data.followUps[1];
      if (f2) {
        const date = f2.date ? this.formatDate(f2.date) : '';
        row[46] = `${date}${date ? ': ' : ''}${f2.detail || ''}`; // Column AU
      }
    }

    return row;
  }

  private formatDate(date?: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // Use Gregorian (AD) dd/m/yyyy
  }

  private normalizePhoneNumber(phone: string): string {
    return phone.replace(/[-\s\(\)]/g, '').replace(/^0/, '66');
  }

  async getNextRunningNumber(): Promise<number> {
    try {
      console.log('🔢 Getting next running number...');

      // Read both A:A (RowId legacy) and F:F (current No.) and take the max
      const [colA, colF] = await Promise.all([
        this.sheets.spreadsheets.values.get({
          spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
          range: `${GOOGLE_CONFIG.sheetName}!A:A`
        }),
        this.sheets.spreadsheets.values.get({
          spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
          range: `${GOOGLE_CONFIG.sheetName}!F:F`
        })
      ]);

      const rowsA = colA.data.values || [];
      const rowsF = colF.data.values || [];

      const maxFrom = (rows: string[][]): number => {
        let max = 0;
        for (let i = 1; i < rows.length; i++) {
          const val = rows[i][0];
          const num = parseInt(val);
          if (!isNaN(num) && num > max) max = num;
        }
        return max;
      };

      const maxA = maxFrom(rowsA);
      const maxF = maxFrom(rowsF);
      const nextNumber = Math.max(maxA, maxF) + 1;
      console.log('✅ Next running number:', nextNumber, `(A:${maxA}, F:${maxF})`);
      return nextNumber;

    } catch (error) {
      console.error('❌ Failed to get running number:', error);
      return 1; // Default to 1 if error
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId
      });

      console.log('✅ Google Sheets connection test successful');
      console.log('   Spreadsheet:', response.data.properties?.title);
      
      return true;
    } catch (error) {
      console.error('❌ Google Sheets connection test failed:', error);
      return false;
    }
  }
}
