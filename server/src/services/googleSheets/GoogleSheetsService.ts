
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
      
      // Set running number in Column A (index 0)
      values[0] = runningNumber;
      
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
      
      // Skip header row, check column M (index 12) for phone numbers
      // Note: Data is now in columns G-AT, so phone number is still in column M (index 12)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const existingPhone = row[12]; // Column M = phone number
        
        if (existingPhone && this.normalizePhoneNumber(existingPhone) === this.normalizePhoneNumber(phoneNumber)) {
          console.log('✅ Found existing customer at row:', i + 1);
          
          return {
            exists: true,
            data: {
              rowNumber: i + 1,
              runningNumber: row[0], // Column A = running number
              fullName: row[11],     // Column L = full name
              email: row[13],        // Column N = email
              lineId: row[14],       // Column O = Line ID
              age: row[15],          // Column P = age
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
    // Map data starting from Column B according to sheet headers
    row[1] = data.salesQueue || '';                   // Column B: Sales Queue
    row[2] = this.formatDate(data.visitDate) || '';   // Column C: DATE (วันที่เข้าโครงการ)
    row[3] = data.leadFromMonth || '';                // Column D: Lead จากเดือน (Detail)
    row[4] = data.mediaOnline || '';                  // Column E: สื่อ Online (ขนุมอมุมา)
    row[5] = data.mediaOffline || '';                 // Column F: สื่อ Offline
    row[6] = data.walkInType || '';                   // Column G: Walk-in Type
    row[7] = data.passSiteSource || '';               // Column H: สื่อ pass site อะไรบ้าง
    row[8] = data.latestStatus || '';                 // Column I: Status สุดท้าย (unqualified/qualified)
    row[9] = data.grade || '';                        // Column J: (next field)
    row[10] = data.fullName || '';                    // Column K: (customer info)
    row[11] = data.phoneNumber || '';                 // Column L: (phone)
    row[12] = data.email || '';                       // Column M: (email)
    row[13] = data.lineId || '';                      // Column N: (Line ID)
    row[14] = data.age || '';                         // Column O: (age)
    row[16] = data.residenceDistrict || '';           // Column Q
    row[17] = data.residenceProvince || '';           // Column R
    row[18] = data.workDistrict || '';                // Column S
    row[19] = data.workProvince || '';                // Column T
    row[20] = data.company || '';                     // Column U
    row[21] = data.position || '';                    // Column V
    row[22] = data.occupation || '';                  // Column W
    row[23] = data.monthlyIncome || '';               // Column X
    row[24] = data.roomType || '';                    // Column Y
    row[25] = data.budget || '';                      // Column Z
    row[26] = data.decisionTimeframe || '';           // Column AA
    row[27] = data.purchasePurpose || '';             // Column AB
    row[28] = data.mainRoute || '';                   // Column AC
    row[29] = data.decisionFactors || '';             // Column AD
    row[30] = data.decisionFactors2 || '';            // Column AE
    
    // Convert arrays to comma-separated strings for Google Sheets compatibility
    row[31] = Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || '');
    row[32] = Array.isArray(data.shoppingMalls) ? data.shoppingMalls.join(', ') : (data.shoppingMalls || '');
    row[33] = Array.isArray(data.promotionInterest) ? data.promotionInterest.join(', ') : (data.promotionInterest || '');           // Column AH
    row[34] = data.comparisonProjects || '';          // Column AI
    row[35] = data.customerDetails || '';             // Column AJ
    row[36] = data.reasonNotBooking || '';            // Column AK
    row[37] = data.reasonNotBookingDetail || '';      // Column AL

    if (data.followUps && data.followUps.length > 0) {
      const followUpStrings = data.followUps.map(fu => {
        const date = fu.date ? this.formatDate(fu.date) : '';
        return `${date}: ${fu.detail}`;
      });
      row[38] = followUpStrings.join('\n'); // Join with newline for readability
    }

    return row;
  }

  private formatDate(date?: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('th-TH');
  }

  private normalizePhoneNumber(phone: string): string {
    return phone.replace(/[-\s\(\)]/g, '').replace(/^0/, '66');
  }

  async getNextRunningNumber(): Promise<number> {
    try {
      console.log('🔢 Getting next running number...');
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        range: `${GOOGLE_CONFIG.sheetName}!A:A`
      });

      const rows = response.data.values || [];
      
      // Skip header row and find the last numeric value
      let maxNumber = 0;
      for (let i = 1; i < rows.length; i++) {
        const value = rows[i][0];
        const num = parseInt(value);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
      
      const nextNumber = maxNumber + 1;
      console.log('✅ Next running number:', nextNumber);
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
