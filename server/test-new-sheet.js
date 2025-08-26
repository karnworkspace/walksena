const dotenv = require('dotenv');
const { testGoogleSheetsConnection } = require('./dist/config/google');

// Load environment variables
dotenv.config();

console.log('🧪 Testing new Google Sheet connection...');
console.log('📋 Current SPREADSHEET_ID:', process.env.SPREADSHEET_ID);

// Test connection
testGoogleSheetsConnection()
  .then(success => {
    if (success) {
      console.log('✅ Connection successful! New sheet is ready to use.');
    } else {
      console.log('❌ Connection failed. Please check your configuration.');
    }
  })
  .catch(error => {
    console.error('💥 Error testing connection:', error);
  });
