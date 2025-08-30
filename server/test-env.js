require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_SERVICE_ACCOUNT exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT);
console.log('SPREADSHEET_ID exists:', !!process.env.SPREADSHEET_ID);

if (process.env.GOOGLE_SERVICE_ACCOUNT) {
  console.log('GOOGLE_SERVICE_ACCOUNT length:', process.env.GOOGLE_SERVICE_ACCOUNT.length);
  console.log('First 50 chars:', process.env.GOOGLE_SERVICE_ACCOUNT.substring(0, 50));
  try {
    const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    console.log('✅ JSON parsing successful');
    console.log('Project ID:', parsed.project_id);
    console.log('Client Email:', parsed.client_email);
  } catch (error) {
    console.log('❌ JSON parsing failed:', error.message);
    console.log('Raw first 100 chars:', process.env.GOOGLE_SERVICE_ACCOUNT.substring(0, 100));
  }
} else {
  console.log('❌ GOOGLE_SERVICE_ACCOUNT is undefined');
}

if (process.env.SPREADSHEET_ID) {
  console.log('✅ SPREADSHEET_ID:', process.env.SPREADSHEET_ID);
} else {
  console.log('❌ SPREADSHEET_ID is undefined');
}
