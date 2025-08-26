const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing Google Sheets connection...');
    
    const serviceAccountKeyPath = path.join(__dirname, 'server/service-account-key.json');
    console.log('Service account key path:', serviceAccountKeyPath);
    
    const auth = new GoogleAuth({
      keyFile: serviceAccountKeyPath,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    const spreadsheetId = process.env.SPREADSHEET_ID;
    console.log('Testing with spreadsheet ID:', spreadsheetId);
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    });
    
    console.log('✅ Connection successful!');
    console.log('   Spreadsheet Title:', response.data.properties?.title);
    console.log('   Available Sheets:', response.data.sheets?.map(sheet => sheet.properties?.title));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();