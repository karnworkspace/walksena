"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testGoogleSheetsConnection = exports.GOOGLE_CONFIG = exports.sheets = exports.auth = void 0;
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
console.log('🔧 Loading Google configuration...');
// Validate environment variables
if (!process.env.SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID environment variable is not set');
}
// Load service account credentials from file
const path = __importStar(require("path"));
const serviceAccountKeyPath = path.join(__dirname, '../../service-account-key.json');
let serviceAccountKey;
try {
    serviceAccountKey = require(serviceAccountKeyPath);
    console.log('✅ Service account credentials loaded from file');
    console.log('   Project ID:', serviceAccountKey.project_id);
    console.log('   Client Email:', serviceAccountKey.client_email);
}
catch (error) {
    console.error('❌ Failed to load service account key file:', error);
    throw error;
}
// Create Google Auth instance with keyFile instead of credentials
exports.auth = new google_auth_library_1.GoogleAuth({
    keyFile: serviceAccountKeyPath,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
});
// Create Google Sheets instance
exports.sheets = googleapis_1.google.sheets({ version: 'v4', auth: exports.auth });
// Export configuration
exports.GOOGLE_CONFIG = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    sheetName: ' Walk-in 2025', // Note: space at the beginning is important
    auth: // Note: space at the beginning is important
    exports.auth,
    sheets: exports.sheets
};
console.log('✅ Google Sheets configuration ready');
console.log('   Spreadsheet ID:', exports.GOOGLE_CONFIG.spreadsheetId);
console.log('   Target Sheet:', exports.GOOGLE_CONFIG.sheetName);
// Test connection function
const testGoogleSheetsConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        console.log('🔍 Testing Google Sheets connection...');
        const response = yield exports.sheets.spreadsheets.get({
            spreadsheetId: exports.GOOGLE_CONFIG.spreadsheetId
        });
        console.log('✅ Google Sheets connection successful!');
        console.log('   Spreadsheet Title:', (_a = response.data.properties) === null || _a === void 0 ? void 0 : _a.title);
        console.log('   Available Sheets:', (_b = response.data.sheets) === null || _b === void 0 ? void 0 : _b.map(sheet => { var _a; return (_a = sheet.properties) === null || _a === void 0 ? void 0 : _a.title; }).join(', '));
        // Check if our target sheet exists
        const targetSheetExists = (_c = response.data.sheets) === null || _c === void 0 ? void 0 : _c.some(sheet => { var _a; return ((_a = sheet.properties) === null || _a === void 0 ? void 0 : _a.title) === exports.GOOGLE_CONFIG.sheetName; });
        if (targetSheetExists) {
            console.log('✅ Target sheet found:', exports.GOOGLE_CONFIG.sheetName);
        }
        else {
            console.log('⚠️  Target sheet not found:', exports.GOOGLE_CONFIG.sheetName);
            console.log('   Available sheets:', (_d = response.data.sheets) === null || _d === void 0 ? void 0 : _d.map(sheet => { var _a; return (_a = sheet.properties) === null || _a === void 0 ? void 0 : _a.title; }));
        }
        return true;
    }
    catch (error) {
        console.error('❌ Google Sheets connection failed:', error);
        return false;
    }
});
exports.testGoogleSheetsConnection = testGoogleSheetsConnection;
