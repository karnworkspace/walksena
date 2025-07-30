"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const google_1 = require("../../config/google");
class GoogleSheetsService {
    constructor() {
        this.sheets = google_1.sheets;
    }
    appendWalkInData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                console.log('📝 Appending data to Google Sheets...');
                // Map form data to sheet columns (A-CF = 84 columns)
                const values = this.mapDataToSheetRow(data);
                const response = yield this.sheets.spreadsheets.values.append({
                    spreadsheetId: google_1.GOOGLE_CONFIG.spreadsheetId,
                    range: `${google_1.GOOGLE_CONFIG.sheetName}!A:CF`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [values]
                    }
                });
                console.log('✅ Data appended successfully');
                console.log('   Range:', (_a = response.data.updates) === null || _a === void 0 ? void 0 : _a.updatedRange);
                // Extract row number from range (e.g., "'Walk-in 2025'!A2:CF2" -> 2)
                const rowNumber = (_d = (_c = (_b = response.data.updates) === null || _b === void 0 ? void 0 : _b.updatedRange) === null || _c === void 0 ? void 0 : _c.match(/(\d+)$/)) === null || _d === void 0 ? void 0 : _d[1];
                return {
                    success: true,
                    rowNumber: rowNumber ? parseInt(rowNumber) : undefined
                };
            }
            catch (error) {
                console.error('❌ Failed to append data:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    checkExistingCustomer(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔍 Checking for existing customer:', phoneNumber);
                // Read all data from the sheet
                const response = yield this.sheets.spreadsheets.values.get({
                    spreadsheetId: google_1.GOOGLE_CONFIG.spreadsheetId,
                    range: `${google_1.GOOGLE_CONFIG.sheetName}!A:CF`
                });
                const rows = response.data.values || [];
                // Skip header row, check column M (index 12) for phone numbers
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const existingPhone = row[12]; // Column M = phone number
                    if (existingPhone && this.normalizePhoneNumber(existingPhone) === this.normalizePhoneNumber(phoneNumber)) {
                        console.log('✅ Found existing customer at row:', i + 1);
                        return {
                            exists: true,
                            data: {
                                rowNumber: i + 1,
                                fullName: row[11], // Column L
                                email: row[13], // Column N
                                lineId: row[14], // Column O
                                age: row[15], // Column P
                                // Add more fields as needed
                            }
                        };
                    }
                }
                console.log('ℹ️  No existing customer found');
                return { exists: false };
            }
            catch (error) {
                console.error('❌ Failed to check existing customer:', error);
                return { exists: false };
            }
        });
    }
    getAllWalkInData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching all data from Google Sheets...');
                const response = yield this.sheets.spreadsheets.values.get({
                    spreadsheetId: google_1.GOOGLE_CONFIG.spreadsheetId,
                    range: `${google_1.GOOGLE_CONFIG.sheetName}!A:CF`,
                });
                const rows = response.data.values || [];
                if (rows.length === 0) {
                    return [];
                }
                const header = rows[0];
                const data = rows.slice(1).map(row => {
                    const rowData = {};
                    header.forEach((key, index) => {
                        rowData[key] = row[index];
                    });
                    return rowData;
                });
                return data;
            }
            catch (error) {
                console.error('Failed to fetch all data:', error);
                throw error;
            }
        });
    }
    getUniqueValues(columnIndex_1) {
        return __awaiter(this, arguments, void 0, function* (columnIndex, maxRows = 100) {
            try {
                const response = yield this.sheets.spreadsheets.values.get({
                    spreadsheetId: google_1.GOOGLE_CONFIG.spreadsheetId,
                    range: `${google_1.GOOGLE_CONFIG.sheetName}!A:CF`
                });
                const rows = response.data.values || [];
                const uniqueValues = new Set();
                // Skip header row and collect unique values
                for (let i = 1; i < Math.min(rows.length, maxRows + 1); i++) {
                    const value = rows[i][columnIndex];
                    if (value && typeof value === 'string' && value.trim() !== '') {
                        uniqueValues.add(value.trim());
                    }
                }
                return Array.from(uniqueValues).sort();
            }
            catch (error) {
                console.error('❌ Failed to get unique values:', error);
                return [];
            }
        });
    }
    mapDataToSheetRow(data) {
        const row = new Array(84).fill(''); // 84 columns (A-CF)
        // Map data to corresponding columns
        row[0] = data.no || ''; // Column A
        row[1] = data.month || ''; // Column B  
        row[2] = data.salesQueue || ''; // Column C
        row[3] = this.formatDate(data.visitDate) || ''; // Column D
        row[4] = data.leadFromMonth || ''; // Column E
        row[5] = data.mediaOnline || ''; // Column F
        row[6] = data.mediaOffline || ''; // Column G
        row[7] = data.walkInType || ''; // Column H
        row[8] = data.passSiteSource || ''; // Column I
        row[9] = data.latestStatus || ''; // Column J
        row[10] = data.grade || ''; // Column K
        row[11] = data.fullName || ''; // Column L
        row[12] = data.phoneNumber || ''; // Column M
        row[13] = data.email || ''; // Column N
        row[14] = data.lineId || ''; // Column O
        row[15] = data.age || ''; // Column P
        row[16] = data.residenceDistrict || ''; // Column Q
        row[17] = data.residenceProvince || ''; // Column R
        row[18] = data.workDistrict || ''; // Column S
        row[19] = data.workProvince || ''; // Column T
        row[20] = data.company || ''; // Column U
        row[21] = data.position || ''; // Column V
        row[22] = data.occupation || ''; // Column W
        row[23] = data.monthlyIncome || ''; // Column X
        row[24] = data.roomType || ''; // Column Y
        row[25] = data.budget || ''; // Column Z
        row[26] = data.decisionTimeframe || ''; // Column AA
        row[27] = data.purchasePurpose || ''; // Column AB
        row[28] = data.mainRoute || ''; // Column AC
        row[29] = data.decisionFactors || ''; // Column AD
        row[30] = data.decisionFactors2 || ''; // Column AE
        // Convert arrays to comma-separated strings for Google Sheets compatibility
        row[31] = Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || '');
        row[32] = Array.isArray(data.shoppingMalls) ? data.shoppingMalls.join(', ') : (data.shoppingMalls || '');
        row[33] = Array.isArray(data.promotionInterest) ? data.promotionInterest.join(', ') : (data.promotionInterest || ''); // Column AH
        row[34] = data.comparisonProjects || ''; // Column AI
        row[35] = data.customerDetails || ''; // Column AJ
        row[36] = data.reasonNotBooking || ''; // Column AK
        row[37] = data.reasonNotBookingDetail || ''; // Column AL
        if (data.followUps && data.followUps.length > 0) {
            const followUpStrings = data.followUps.map(fu => {
                const date = fu.date ? this.formatDate(fu.date) : '';
                return `${date}: ${fu.detail}`;
            });
            row[38] = followUpStrings.join('\n'); // Join with newline for readability
        }
        return row;
    }
    formatDate(date) {
        if (!date)
            return '';
        return new Date(date).toLocaleDateString('th-TH');
    }
    normalizePhoneNumber(phone) {
        return phone.replace(/[-\s\(\)]/g, '').replace(/^0/, '66');
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield this.sheets.spreadsheets.get({
                    spreadsheetId: google_1.GOOGLE_CONFIG.spreadsheetId
                });
                console.log('✅ Google Sheets connection test successful');
                console.log('   Spreadsheet:', (_a = response.data.properties) === null || _a === void 0 ? void 0 : _a.title);
                return true;
            }
            catch (error) {
                console.error('❌ Google Sheets connection test failed:', error);
                return false;
            }
        });
    }
}
exports.GoogleSheetsService = GoogleSheetsService;
