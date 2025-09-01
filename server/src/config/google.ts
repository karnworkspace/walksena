import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 Loading Google configuration...');

// Validate environment variables
if (!process.env.SPREADSHEET_ID) {
  throw new Error('SPREADSHEET_ID environment variable is not set');
}

// Load service account credentials from environment variable
let serviceAccountKey: any;
try {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountJson) {
    serviceAccountKey = JSON.parse(serviceAccountJson);
    
    // Fix private key format for OpenSSL compatibility
    if (serviceAccountKey.private_key) {
      // Replace \n with actual newlines
      serviceAccountKey.private_key = serviceAccountKey.private_key.replace(/\\n/g, '\n');
    }
    
    console.log('✅ Service account credentials loaded from environment');
    console.log('   Project ID:', serviceAccountKey.project_id);
    console.log('   Client Email:', serviceAccountKey.client_email);
  } else {
    throw new Error('GOOGLE_SERVICE_ACCOUNT or GOOGLE_SERVICE_ACCOUNT_KEY environment variable not found');
  }
} catch (error) {
  console.error('❌ Failed to load service account credentials:', error);
  throw error;
}

// Create Google Auth instance
export const auth = new GoogleAuth({
  credentials: serviceAccountKey,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ]
});

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

