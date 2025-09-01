import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

console.log('🔧 Loading Google configuration...');

if (!process.env.SPREADSHEET_ID) {
  throw new Error('SPREADSHEET_ID environment variable is not set');
}

let auth: GoogleAuth;

// Check if we're in a production/Replit environment (has GOOGLE_SERVICE_ACCOUNT)
const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
if (serviceAccountJson) {
  try {
    console.log('📋 Using service account credentials from environment variable');
    const credentials = JSON.parse(serviceAccountJson);
    auth = new GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]
    });
    console.log('✅ Service account credentials loaded from environment variable');
    console.log('   Project ID:', credentials.project_id);
  } catch (error) {
    console.error('❌ Failed to parse GOOGLE_SERVICE_ACCOUNT from environment variable:', error);
    throw error;
  }
} else {
  // Fallback to reading from a file (for local development)
  console.log('📁 Using service account key file for local development');
  const serviceAccountKeyPath = path.join(__dirname, '../../service-account-key.json');
  try {
    // Check if file exists
    require.resolve(serviceAccountKeyPath);
    auth = new GoogleAuth({
      keyFile: serviceAccountKeyPath,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]
    });
    console.log(`✅ Service account credentials loaded from file: ${serviceAccountKeyPath}`);
  } catch (error) {
    console.error(`❌ Failed to load service account key from file: ${serviceAccountKeyPath}`, error);
    console.error('   Please make sure service-account-key.json exists in the server/ directory for local development.');
    throw error;
  }
}

// Create Google Sheets instance
export const sheets = google.sheets({ version: 'v4', auth });

// Export configuration
export const GOOGLE_CONFIG = {
  spreadsheetId: process.env.SPREADSHEET_ID,
  sheetName: 'Walk-In', // Updated sheet name
  auth,
  sheets
};

console.log('✅ Google Sheets configuration ready');
console.log('   Spreadsheet ID:', GOOGLE_CONFIG.spreadsheetId);
console.log('   Target Sheet:', GOOGLE_CONFIG.sheetName);

// Test connection function
export const testGoogleSheetsConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing Google Sheets connection...');
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_CONFIG.spreadsheetId
    });
    
    console.log('✅ Google Sheets connection successful!');
    console.log('   Spreadsheet Title:', response.data.properties?.title);
    console.log('   Available Sheets:', response.data.sheets?.map(sheet => sheet.properties?.title).join(', '));
    
    // Check if our target sheet exists
    const targetSheetExists = response.data.sheets?.some(
      sheet => sheet.properties?.title === GOOGLE_CONFIG.sheetName
    );
    
    if (targetSheetExists) {
      console.log('✅ Target sheet found:', GOOGLE_CONFIG.sheetName);
    } else {
      console.log('⚠️  Target sheet not found:', GOOGLE_CONFIG.sheetName);
      console.log('   Available sheets:', response.data.sheets?.map(sheet => sheet.properties?.title));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Google Sheets connection failed:', error);
    return false;
  }
};

export { auth };