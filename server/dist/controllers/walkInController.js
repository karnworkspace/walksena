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
exports.testConnection = exports.getWalkInEntries = exports.getDropdownOptions = exports.checkCustomer = exports.submitWalkInForm = void 0;
const GoogleSheetsService_1 = require("../services/googleSheets/GoogleSheetsService");
const googleSheetsService = new GoogleSheetsService_1.GoogleSheetsService();
/**
 * Submit walk-in form data
 */
const submitWalkInForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📝 Received walk-in form submission');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        const formData = req.body;
        // Check if this is a draft submission
        const isDraft = formData.isDraft === true;
        console.log('Is draft submission:', isDraft);
        // For non-draft submissions, validate required fields
        if (!isDraft) {
            const validation = validateWalkInForm(formData);
            if (!validation.isValid) {
                console.log('❌ Validation failed:', validation.errors);
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: validation.errors
                });
            }
        }
        else {
            console.log('💾 Saving draft - skipping validation');
        }
        // Check for existing customer if phone number is provided
        let existingCustomer = null;
        if (formData.phoneNumber) {
            const customerCheck = yield googleSheetsService.checkExistingCustomer(formData.phoneNumber);
            if (customerCheck.exists) {
                existingCustomer = customerCheck.data;
                console.log('ℹ️  Found existing customer:', existingCustomer);
            }
        }
        // Add metadata
        const enrichedData = Object.assign(Object.assign(Object.assign({}, formData), { month: formData.visitDate ? new Date(formData.visitDate).toLocaleDateString('en-US', { month: 'long' }) : undefined, visitDate: formData.visitDate ? new Date(formData.visitDate).toISOString() : new Date().toISOString() }), (isDraft && {
            latestStatus: formData.latestStatus || 'Draft - In Progress',
            grade: formData.grade || 'Draft'
        }));
        // Submit to Google Sheets
        const result = yield googleSheetsService.appendWalkInData(enrichedData);
        if (result.success) {
            console.log('✅ Form submitted successfully');
            const message = isDraft ?
                'Draft saved successfully! You can continue later.' :
                'Walk-in form submitted successfully';
            res.json({
                success: true,
                message: message,
                data: {
                    rowNumber: result.rowNumber,
                    existingCustomer: existingCustomer,
                    isDraft: isDraft
                }
            });
        }
        else {
            console.error('❌ Failed to submit form:', result.error);
            const errorMessage = isDraft ? 'Failed to save draft' : 'Failed to submit form';
            res.status(500).json({
                success: false,
                error: errorMessage,
                details: result.error
            });
        }
    }
    catch (error) {
        console.error('❌ Controller error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.submitWalkInForm = submitWalkInForm;
/**
 * Check if customer exists by phone number
 */
const checkCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.query;
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }
        console.log('🔍 Checking customer:', phoneNumber);
        const result = yield googleSheetsService.checkExistingCustomer(phoneNumber);
        res.json({
            success: true,
            exists: result.exists,
            customer: result.data || null
        });
    }
    catch (error) {
        console.error('❌ Customer check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check customer',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.checkCustomer = checkCustomer;
/**
 * Get dropdown options for form fields
 */
const getDropdownOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📋 Fetching dropdown options');
        // Static options
        const staticOptions = {
            salesQueue: [
                { value: 'A', label: 'A' },
                { value: 'Lukpla', label: 'Lukpla' },
                { value: 'Pare', label: 'Pare' }
            ],
            walkInType: [
                { value: 'Appointment', label: 'Appointment (นัดหมาย)' },
                { value: 'Pass site', label: 'Pass Site (มีโอกาสเดินทางผ่านโครงการ)' },
                { value: 're visit', label: 'Re visit (มาอีกรอบ)' }
            ],
            mediaOnline: [
                { value: 'Website SENA', label: 'Website SENA' },
                { value: 'Facebook', label: 'Facebook' },
                { value: 'Youtube', label: 'Youtube' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'Google', label: 'Google' },
                { value: 'Line', label: 'Line' },
                { value: 'Blogger', label: 'Blogger' },
                { value: 'TikTok', label: 'TikTok' }
            ],
            mediaOffline: [
                { value: 'ป้ายหน้าโครงการ', label: 'ป้ายหน้าโครงการ' },
                { value: 'ป้ายบอกทาง', label: 'ป้ายบอกทาง' },
                { value: 'Billboard', label: 'Billboard' },
                { value: 'ใบปลิว', label: 'ใบปลิว' },
                { value: 'SMS', label: 'SMS' },
                { value: 'รถ MuvMi', label: 'รถ MuvMi' },
                { value: 'เพื่อนแนะนำ', label: 'เพื่อนแนะนำ' },
                { value: 'มีโอกาสเดินทางผ่านโครงการ', label: 'มีโอกาสเดินทางผ่านโครงการ' },
                { value: 'ลูกค้าส่วนตัว', label: 'ลูกค้าส่วนตัว' },
                { value: 'ป้ายโฆษณาเอกมัย14', label: 'ป้ายโฆษณาเอกมัย14' },
                { value: 'อื่นๆ', label: 'อื่นๆ' }
            ],
            passSiteSource: [
                { value: 'ป้ายหน้าโครงการ', label: 'ป้ายหน้าโครงการ' },
                { value: 'ป้ายบอกทาง', label: 'ป้ายบอกทาง' },
                { value: 'ป้ายโฆษณาเอกมัย14', label: 'ป้ายโฆษณาเอกมัย14' },
                { value: 'Blogger', label: 'Blogger' },
                { value: 'Google', label: 'Google' },
                { value: 'Facebook', label: 'Facebook' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'Google Maps', label: 'Google Maps' }
            ],
            grade: [
                { value: 'A (Potential)', label: 'A (Potential)', description: 'มีศักยภาพสูง พร้อมตัดสินใจ' },
                { value: 'B', label: 'B (Interested)', description: 'สนใจ แต่ยังไม่พร้อมตัดสินใจ' },
                { value: 'C', label: 'C (Casual)', description: 'ดูข้อมูลเบื้องต้น' },
                { value: 'F', label: 'F (Dead)', description: 'ไม่สนใจ หรือไม่มีศักยภาพ' }
            ]
        };
        // No need for dynamic options from Google Sheets anymore since we have static lists
        res.json({
            success: true,
            options: staticOptions,
            lastUpdated: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Dropdown options error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dropdown options',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getDropdownOptions = getDropdownOptions;
/**
 * Get all walk-in entries
 */
const getWalkInEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching all walk-in entries');
        const entries = yield googleSheetsService.getAllWalkInData();
        res.json({ success: true, data: entries });
    }
    catch (error) {
        console.error('Error fetching walk-in entries:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch entries' });
    }
});
exports.getWalkInEntries = getWalkInEntries;
/**
 * Test Google Sheets connection
 */
const testConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔧 Testing Google Sheets connection');
        const isConnected = yield googleSheetsService.testConnection();
        if (isConnected) {
            res.json({
                success: true,
                message: 'Google Sheets connection successful',
                timestamp: new Date().toISOString()
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Google Sheets connection failed'
            });
        }
    }
    catch (error) {
        console.error('❌ Connection test error:', error);
        res.status(500).json({
            success: false,
            error: 'Connection test failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.testConnection = testConnection;
/**
 * Validate walk-in form data
 */
function validateWalkInForm(data) {
    const errors = [];
    // Required fields
    if (!data.salesQueue) {
        errors.push('Sales Queue is required');
    }
    if (!data.walkInType) {
        errors.push('Walk-in Type is required');
    }
    if (!data.fullName) {
        errors.push('Full Name is required');
    }
    if (!data.phoneNumber) {
        errors.push('Phone Number is required');
    }
    else if (!/^[0-9]{9,10}$/.test(data.phoneNumber.replace(/[-\s]/g, ''))) {
        errors.push('Phone Number format is invalid');
    }
    if (!data.grade) {
        errors.push('Grade is required');
    }
    // Date validation - Allow future dates for appointments
    // Remove this validation as appointments can be scheduled for future dates
    // if (data.visitDate && new Date(data.visitDate) > new Date()) {
    //   errors.push('Visit Date cannot be in the future');
    // }
    // Email validation (if provided)
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Email format is invalid');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
