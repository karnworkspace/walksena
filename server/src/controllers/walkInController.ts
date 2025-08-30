// src/controllers/walkInController.ts
import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/googleSheets/GoogleSheetsService';
import { WalkInFormData } from '../models/WalkInForm';

const googleSheetsService = new GoogleSheetsService();

/**
 * Submit walk-in form data
 */
export const submitWalkInForm = async (req: Request, res: Response) => {
  try {
    console.log('📝 Received walk-in form submission');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const formData: WalkInFormData = req.body;

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
    } else {
      console.log('💾 Saving draft - skipping validation');
    }

    // Check for existing customer if phone number is provided
    let existingCustomer = null;
    if (formData.phoneNumber) {
      const customerCheck = await googleSheetsService.checkExistingCustomer(formData.phoneNumber);
      if (customerCheck.exists) {
        existingCustomer = customerCheck.data;
        console.log('ℹ️  Found existing customer:', existingCustomer);
      }
    }

    // Add metadata
    const enrichedData: WalkInFormData = {
      ...formData,
      month: formData.visitDate ? new Date(formData.visitDate).toLocaleDateString('en-US', { month: 'long' }) : undefined,
      visitDate: formData.visitDate ? new Date(formData.visitDate).toISOString() : new Date().toISOString(),
      // Add draft-specific metadata
      ...(isDraft && {
        latestStatus: formData.latestStatus || 'Draft - In Progress',
        grade: formData.grade || 'Draft'
      })
    };

    // Submit to Google Sheets
    const result = await googleSheetsService.appendWalkInData(enrichedData);

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
    } else {
      console.error('❌ Failed to submit form:', result.error);
      
      const errorMessage = isDraft ? 'Failed to save draft' : 'Failed to submit form';
      
      res.status(500).json({
        success: false,
        error: errorMessage,
        details: result.error
      });
    }

  } catch (error) {
    console.error('❌ Controller error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update existing walk-in form data by running number (Column A)
 */
export const updateWalkInForm = async (req: Request, res: Response) => {
  try {
    console.log('🛠️  Updating walk-in form');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const formData: WalkInFormData = req.body;
    const runningNumber = Number(formData.no || req.body.runningNumber || req.body.recordId);

    if (!runningNumber || Number.isNaN(runningNumber)) {
      return res.status(400).json({ success: false, error: 'Missing running number (no)' });
    }

    // Normalize visit date
    const enrichedData: WalkInFormData = {
      ...formData,
      month: formData.visitDate ? new Date(formData.visitDate).toLocaleDateString('en-US', { month: 'long' }) : undefined,
      visitDate: formData.visitDate ? new Date(formData.visitDate).toISOString() : undefined,
    };

    // Ensure monthlyIncome is a string (range) if sent as object/array
    if (enrichedData && typeof (enrichedData as any).monthlyIncome === 'object') {
      (enrichedData as any).monthlyIncome = String((enrichedData as any).monthlyIncome);
    }

    const result = await googleSheetsService.updateByRunningNumber(runningNumber, enrichedData);

    if (result.success) {
      return res.json({ success: true, message: 'Row updated', rowNumber: result.rowNumber });
    }

    return res.status(500).json({ success: false, error: result.error || 'Failed to update row' });
  } catch (error) {
    console.error('❌ Update controller error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Check if customer exists by phone number
 */
export const checkCustomer = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    console.log('🔍 Checking customer:', phoneNumber);

    const result = await googleSheetsService.checkExistingCustomer(phoneNumber);

    res.json({
      success: true,
      exists: result.exists,
      customer: result.data || null
    });

  } catch (error) {
    console.error('❌ Customer check error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to check customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get dropdown options for form fields
 */
export const getDropdownOptions = async (req: Request, res: Response) => {
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

  } catch (error) {
    console.error('❌ Dropdown options error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dropdown options',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all walk-in entries
 */
export const getWalkInEntries = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all walk-in entries');
    const entries = await googleSheetsService.getAllWalkInData();
    res.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching walk-in entries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch entries' });
  }
};

/**
 * Test Google Sheets connection
 */
export const testConnection = async (req: Request, res: Response) => {
  try {
    console.log('🔧 Testing Google Sheets connection');

    const isConnected = await googleSheetsService.testConnection();

    if (isConnected) {
      res.json({
        success: true,
        message: 'Google Sheets connection successful',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Google Sheets connection failed'
      });
    }

  } catch (error) {
    console.error('❌ Connection test error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Validate walk-in form data
 */
function validateWalkInForm(data: WalkInFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

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
  } else if (!/^[0-9]{9,10}$/.test(data.phoneNumber.replace(/[-\s]/g, ''))) {
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
