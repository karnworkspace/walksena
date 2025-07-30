# Walk-in 2025 Form - Developer Specification

## 📋 Project Overview

### Project Scope
สร้าง Web Application Form สำหรับบันทึกข้อมูลลูกค้า Walk-in แทนการกรอกข้อมูลใน Google Sheets โดยตรง

### Business Requirements
- ลดข้อผิดพลาดในการกรอกข้อมูล
- เพิ่มประสิทธิภาพการทำงานของ Sales Team
- Real-time sync ข้อมูลกับ Google Sheets
- รองรับการใช้งานบน Mobile และ Desktop

## 🏗️ System Architecture

### Technology Stack
```
Frontend: React.js 18+ with TypeScript
UI Framework: Ant Design 5.x หรือ Material-UI 5.x
State Management: Redux Toolkit + RTK Query
Form Handling: React Hook Form + Yup validation
HTTP Client: Axios
Date Handling: Day.js
```

```
Backend: Node.js 18+ with Express.js
Database Cache: Redis 7.x
API Integration: Google Sheets API v4
Authentication: Google OAuth 2.0
Environment: Docker containers
```

```
Infrastructure:
Frontend Hosting: Vercel
Backend Hosting: Railway หรือ Google Cloud Run
Cache: Redis Cloud
Monitoring: Sentry + Google Analytics
```

## 📊 Database Schema (Google Sheets Mapping)

### Target Sheet: " Walk-in 2025"
**Sheet Range**: A1:CF895  
**Total Columns**: 84 (42 ใช้งานจริง)

### Column Mapping
```typescript
interface WalkInFormData {
  // Basic Visit Information (Columns A-K)
  no?: number;                          // Column A
  month?: string;                       // Column B  
  salesQueue: string;                   // Column C *Required
  visitDate: Date;                      // Column D *Required
  leadFromMonth?: string;               // Column E
  mediaOnline?: string;                 // Column F
  mediaOffline?: string;                // Column G
  walkInType: string;                   // Column H *Required
  passSiteSource?: string;              // Column I
  latestStatus?: string;                // Column J
  grade: string;                        // Column K *Required
  
  // Customer Information (Columns L-P)
  fullName: string;                     // Column L *Required
  phoneNumber: string;                  // Column M *Required
  email?: string;                       // Column N
  lineId?: string;                      // Column O
  age?: number;                         // Column P
  
  // Location Information (Columns Q-T)
  residenceDistrict?: string;           // Column Q
  residenceProvince?: string;           // Column R
  workDistrict?: string;                // Column S
  workProvince?: string;                // Column T
  
  // Work Information (Columns U-X)
  company?: string;                     // Column U
  position?: string;                    // Column V
  occupation?: string;                  // Column W
  monthlyIncome?: number;               // Column X
  
  // Preferences (Columns Y-AB)
  roomType?: string;                    // Column Y
  budget?: number;                      // Column Z
  decisionTimeframe?: string;           // Column AA
  purchasePurpose?: string;             // Column AB
  
  // Additional Info (Columns AC-AH)
  mainRoute?: string;                   // Column AC
  decisionFactors?: string;             // Column AD
  decisionFactors2?: string;            // Column AE
  interests?: string;                   // Column AF
  shoppingMalls?: string;               // Column AG
  promotionInterest?: string;           // Column AH
  
  // Analysis (Columns AI-AL)
  comparisonProjects?: string;          // Column AI
  customerDetails?: string;             // Column AJ
  reasonNotBooking?: string;            // Column AK
  reasonNotBookingDetail?: string;      // Column AL
  
  // Follow-up (Columns AM-AO)
  followUpDate?: Date;                  // Column AM
  followUp?: string;                    // Column AN
  followUp2?: string;                   // Column AO
}
```

## 🎨 UI/UX Specifications

### 1. Overall Layout
```
┌─────────────────────────────────────────────────────────┐
│                      Header                             │
│  🏠 Walk-in Form    [User: John]    [Language: TH] [?] │
├─────────────────────────────────────────────────────────┤
│                   Progress Bar                          │
│  ●●●○○ Step 3 of 5: Location & Work Information        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Form Content                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              [< Previous]    [Next >]                  │
│                 [Save Draft]                           │
└─────────────────────────────────────────────────────────┘
```

### 2. Form Steps Structure

#### Step 1: Visit Information
```typescript
interface Step1Data {
  visitDate: Date;                    // Required, Date Picker
  salesQueue: string;                 // Required, Dropdown
  walkInType: string;                 // Required, Radio buttons
  mediaOnline?: string;               // Optional, Dropdown
  mediaOffline?: string;              // Optional, Dropdown
  passSiteSource?: string;            // Optional, Text input
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                 Step 1: Visit Information              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  วันที่เข้าชมโครงการ *                                  │
│  [📅 25/01/2025        ]                              │
│                                                         │
│  Sales ผู้ดูแล *                                        │
│  [Dropdown: A ▼        ]                              │
│                                                         │
│  ประเภท Walk-in *                                       │
│  ○ Appointment  ○ Pass site  ○ Re visit                │
│                                                         │
│  สื่อ Online                                            │
│  [Dropdown: เลือกสื่อ ▼]                               │
│                                                         │
│  สื่อ Offline                                           │
│  [Dropdown: เลือกสื่อ ▼]                               │
│                                                         │
│  แหล่งที่มา Pass site (หากเลือก Pass site)             │
│  [Text input________________________]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Step 2: Customer Information
```typescript
interface Step2Data {
  fullName: string;                   // Required, Text input
  phoneNumber: string;                // Required, Tel input with validation
  email?: string;                     // Optional, Email input
  lineId?: string;                    // Optional, Text input
  age?: number;                       // Optional, Number input
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│               Step 2: Customer Information              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ชื่อ - นามสกุล *                                       │
│  [Text input________________________]                  │
│                                                         │
│  หมายเลขโทรศัพท์ *                                      │
│  [Tel input: 099-999-9999]  [🔍 Check existing]       │
│  ℹ️  พบข้อมูลลูกค้าเดิม: คุณ John Doe                   │
│                                                         │
│  Email                                                  │
│  [Email input_____________________]                     │
│                                                         │
│  Line ID                                                │
│  [Text input______________________]                     │
│                                                         │
│  อายุ                                                   │
│  [Number input____] ปี                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Step 3: Location & Work
```typescript
interface Step3Data {
  residenceDistrict?: string;         // Optional, Dropdown
  residenceProvince?: string;         // Optional, Dropdown  
  workDistrict?: string;              // Optional, Dropdown
  workProvince?: string;              // Optional, Dropdown
  company?: string;                   // Optional, Text input
  position?: string;                  // Optional, Text input
  occupation?: string;                // Optional, Dropdown
  monthlyIncome?: number;             // Optional, Number/Dropdown
}
```

#### Step 4: Preferences & Requirements
```typescript
interface Step4Data {
  roomType?: string;                  // Optional, Dropdown
  budget?: number;                    // Optional, Number input
  decisionTimeframe?: string;         // Optional, Dropdown
  purchasePurpose?: string;           // Optional, Dropdown
  interests?: string;                 // Optional, Multi-select
  shoppingMalls?: string;             // Optional, Text input
}
```

#### Step 5: Assessment & Follow-up
```typescript
interface Step5Data {
  grade: string;                      // Required, Radio buttons with descriptions
  latestStatus?: string;              // Optional, Dropdown
  customerDetails?: string;           // Optional, Text area
  reasonNotBooking?: string;          // Optional, Text area
  followUp?: string;                  // Optional, Text area
  followUpDate?: Date;                // Optional, Date picker
}
```

## 🔧 Technical Implementation Details

### 1. Form Validation Rules

#### Client-side Validation (Yup Schema)
```typescript
import * as Yup from 'yup';

const step1Schema = Yup.object({
  visitDate: Yup.date()
    .required('กรุณาเลือกวันที่เข้าชมโครงการ')
    .max(new Date(), 'วันที่ไม่สามารถเป็นอนาคตได้')
    .min(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'วันที่ไม่เกิน 30 วันที่ผ่านมา'),
  
  salesQueue: Yup.string()
    .required('กรุณาเลือก Sales ผู้ดูแล')
    .oneOf(['A', 'Lukpla', 'Pare'], 'Sales ผู้ดูแลไม่ถูกต้อง'),
  
  walkInType: Yup.string()
    .required('กรุณาเลือกประเภท Walk-in')
    .oneOf(['Appointment', 'Pass site', 're visit'], 'ประเภท Walk-in ไม่ถูกต้อง')
});

const step2Schema = Yup.object({
  fullName: Yup.string()
    .required('กรุณากรอกชื่อ-นามสกุล')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  
  phoneNumber: Yup.string()
    .required('กรุณากรอกหมายเลขโทรศัพท์')
    .matches(/^[0-9]{9,10}$/, 'หมายเลขโทรศัพท์ไม่ถูกต้อง')
    .test('phone-format', 'รูปแบบเบอร์โทรไม่ถูกต้อง', (value) => {
      return /^(0[6-9][0-9]{8}|0[2-5][0-9]{7})$/.test(value || '');
    }),
  
  email: Yup.string()
    .email('รูปแบบ Email ไม่ถูกต้อง')
    .nullable(),
  
  age: Yup.number()
    .min(18, 'อายุต้องมากกว่า 18 ปี')
    .max(80, 'อายุต้องไม่เกิน 80 ปี')
    .nullable()
});
```

#### Business Rules Validation
```typescript
interface ValidationRules {
  duplicatePhoneCheck: boolean;       // ตรวจสอบเบอร์โทรซ้ำ
  autoFillExistingCustomer: boolean;  // Auto-fill ข้อมูลลูกค้าเดิม
  gradeConsistencyCheck: boolean;     // ตรวจสอบความสอดคล้องของ Grade กับข้อมูล
  requiredFieldsByGrade: {            // Required fields ตาม Grade
    'A': ['phoneNumber', 'fullName', 'budget', 'roomType'];
    'B': ['phoneNumber', 'fullName', 'budget'];
    'C': ['phoneNumber', 'fullName'];
    'F': ['phoneNumber', 'fullName', 'reasonNotBooking'];
  };
}
```

### 2. Dropdown Options Management

#### Static Options (Hard-coded)
```typescript
export const DROPDOWN_OPTIONS = {
  salesQueue: [
    { value: 'A', label: 'A' },
    { value: 'Lukpla', label: 'Lukpla' },
    { value: 'Pare', label: 'Pare' }
  ],
  
  walkInType: [
    { value: 'Appointment', label: 'Appointment (นัดหมาย)' },
    { value: 'Pass site', label: 'Pass site (เดินผ่านมา)' },
    { value: 're visit', label: 'Re visit (มาอีกรอบ)' }
  ],
  
  grade: [
    { 
      value: 'A (Potential)', 
      label: 'A (Potential)', 
      description: 'มีศักยภาพสูง พร้อมตัดสินใจ' 
    },
    { 
      value: 'B', 
      label: 'B (Interested)', 
      description: 'สนใจ แต่ยังไม่พร้อมตัดสินใจ' 
    },
    { 
      value: 'C', 
      label: 'C (Casual)', 
      description: 'ดูข้อมูลเบื้องต้น' 
    },
    { 
      value: 'F', 
      label: 'F (Dead)', 
      description: 'ไม่สนใจ หรือไม่มีศักยภาพ' 
    }
  ]
};
```

#### Dynamic Options (API-loaded)
```typescript
// ดึงข้อมูล dropdown จาก Google Sheets
export const useDynamicOptions = () => {
  const { data: mediaOnlineOptions } = useQuery(
    ['dropdown', 'mediaOnline'],
    () => api.getUniqueValues('Walk-in 2025', 'F'), // Column F
    { staleTime: 30 * 60 * 1000 } // Cache 30 minutes
  );
  
  const { data: locationOptions } = useQuery(
    ['dropdown', 'locations'],
    () => api.getThailandLocations(),
    { staleTime: 24 * 60 * 60 * 1000 } // Cache 24 hours
  );
  
  return { mediaOnlineOptions, locationOptions };
};
```

### 3. Auto-completion & Smart Features

#### Existing Customer Detection
```typescript
const useCustomerLookup = () => {
  const [lookupTrigger] = useLazyQuery(LOOKUP_CUSTOMER);
  
  const checkExistingCustomer = useCallback(
    debounce(async (phoneNumber: string) => {
      if (phoneNumber.length >= 9) {
        const result = await lookupTrigger({
          variables: { phoneNumber }
        });
        
        if (result.data?.customer) {
          // Show existing customer data
          setExistingCustomer(result.data.customer);
          // Auto-fill form with existing data
          autoFillForm(result.data.customer);
        }
      }
    }, 500),
    []
  );
  
  return { checkExistingCustomer };
};
```

#### Auto-fill Implementation
```typescript
const autoFillForm = (customerData: ExistingCustomer) => {
  setValue('fullName', customerData.fullName);
  setValue('email', customerData.email);
  setValue('lineId', customerData.lineId);
  setValue('residenceDistrict', customerData.residenceDistrict);
  setValue('workDistrict', customerData.workDistrict);
  setValue('occupation', customerData.occupation);
  
  // Show confirmation dialog
  setShowAutoFillDialog(true);
};
```

### 4. Google Sheets API Integration

#### API Configuration
```typescript
// Google Sheets API setup
export const SHEETS_CONFIG = {
  spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
  sheetName: ' Walk-in 2025',
  range: 'A:CF',
  valueInputOption: 'USER_ENTERED'
};

// API Service
export class GoogleSheetsService {
  private auth: GoogleAuth;
  private sheets: sheets_v4.Sheets;
  
  constructor() {
    this.auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }
  
  async appendRow(data: WalkInFormData): Promise<void> {
    const values = this.mapDataToSheetRow(data);
    
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: SHEETS_CONFIG.spreadsheetId,
      range: `${SHEETS_CONFIG.sheetName}!A:CF`,
      valueInputOption: SHEETS_CONFIG.valueInputOption,
      requestBody: { values: [values] }
    });
  }
  
  private mapDataToSheetRow(data: WalkInFormData): any[] {
    // Map form data to sheet columns A-CF
    const row = new Array(84).fill('');
    
    row[0] = data.no || '';                    // Column A
    row[1] = data.month || '';                 // Column B
    row[2] = data.salesQueue || '';            // Column C
    row[3] = data.visitDate || '';             // Column D
    row[4] = data.leadFromMonth || '';         // Column E
    // ... map all fields to corresponding columns
    
    return row;
  }
}
```

#### Error Handling & Retry Logic
```typescript
const useFormSubmission = () => {
  const [submitForm] = useMutation(SUBMIT_WALKIN_FORM, {
    onSuccess: (data) => {
      showSuccessNotification('บันทึกข้อมูลสำเร็จ');
      clearForm();
      redirectToSuccessPage();
    },
    
    onError: (error) => {
      if (error.code === 'NETWORK_ERROR') {
        // Save to local storage for retry
        saveToLocalStorage(formData);
        showRetryDialog();
      } else if (error.code === 'VALIDATION_ERROR') {
        showValidationErrors(error.details);
      } else {
        showErrorNotification('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    },
    
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
```

### 5. State Management

#### Redux Store Structure
```typescript
interface AppState {
  walkInForm: {
    currentStep: number;
    formData: Partial<WalkInFormData>;
    validation: {
      errors: Record<string, string>;
      touched: Record<string, boolean>;
    };
    submission: {
      loading: boolean;
      error: string | null;
      success: boolean;
    };
    existingCustomer: ExistingCustomer | null;
    autoFillSuggestion: boolean;
  };
  
  dropdowns: {
    options: Record<string, DropdownOption[]>;
    loading: Record<string, boolean>;
    lastUpdated: Record<string, number>;
  };
  
  user: {
    profile: UserProfile;
    permissions: string[];
    preferences: UserPreferences;
  };
}
```

#### Actions & Reducers
```typescript
// Actions
export const walkInFormActions = {
  setCurrentStep: (step: number) => ({ type: 'SET_CURRENT_STEP', payload: step }),
  updateFormData: (data: Partial<WalkInFormData>) => ({ type: 'UPDATE_FORM_DATA', payload: data }),
  setValidationError: (field: string, error: string) => ({ type: 'SET_VALIDATION_ERROR', payload: { field, error } }),
  clearForm: () => ({ type: 'CLEAR_FORM' }),
  setExistingCustomer: (customer: ExistingCustomer) => ({ type: 'SET_EXISTING_CUSTOMER', payload: customer })
};

// Reducer
const walkInFormReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
      
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
      
    // ... other cases
  }
};
```

## 📱 Mobile Responsiveness

### Breakpoints
```css
/* Mobile First Approach */
.form-container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .form-container {
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .form-container {
    padding: 32px;
    max-width: 800px;
  }
}
```

### Touch-friendly Design
```typescript
const MobileFormField = ({ type, ...props }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <input
      {...props}
      style={{
        minHeight: isMobile ? '44px' : '32px',  // Touch target size
        fontSize: isMobile ? '16px' : '14px',   // Prevent zoom on iOS
        padding: isMobile ? '12px' : '8px'
      }}
    />
  );
};
```

## 🔒 Security & Authentication

### Google OAuth Integration
```typescript
import { GoogleAuth } from 'google-auth-library';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const signIn = async () => {
    try {
      const result = await window.gapi.auth2.getAuthInstance().signIn();
      const profile = result.getBasicProfile();
      
      setUser({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl()
      });
      
      // Set auth token for API calls
      setAuthToken(result.getAuthResponse().access_token);
      
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };
  
  return { user, signIn };
};
```

### Role-based Access Control
```typescript
const PERMISSIONS = {
  SALES_A: ['view_all_leads', 'edit_own_leads', 'create_leads'],
  SALES_LUKPLA: ['view_all_leads', 'edit_own_leads', 'create_leads'], 
  SALES_PARE: ['view_all_leads', 'edit_own_leads', 'create_leads'],
  MANAGER: ['view_all_leads', 'edit_all_leads', 'create_leads', 'delete_leads', 'export_data'],
  ADMIN: ['*'] // All permissions
};

const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string) => {
    const userRole = getUserRole(user);
    const userPermissions = PERMISSIONS[userRole] || [];
    
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };
  
  return { hasPermission };
};
```

## 🧪 Testing Requirements

### Unit Tests
```typescript
// Form validation tests
describe('WalkInForm Validation', () => {
  test('should require visit date', async () => {
    const result = await step1Schema.validate({ salesQueue: 'A', walkInType: 'Appointment' });
    expect(result).toThrow('กรุณาเลือกวันที่เข้าชมโครงการ');
  });
  
  test('should validate phone number format', async () => {
    const result = await step2Schema.validate({ 
      fullName: 'John Doe', 
      phoneNumber: '123' 
    });
    expect(result).toThrow('หมายเลขโทรศัพท์ไม่ถูกต้อง');
  });
});

// API integration tests
describe('Google Sheets Integration', () => {
  test('should append row successfully', async () => {
    const mockData: WalkInFormData = {
      salesQueue: 'A',
      visitDate: new Date(),
      walkInType: 'Appointment',
      fullName: 'Test User',
      phoneNumber: '0999999999',
      grade: 'A (Potential)'
    };
    
    const service = new GoogleSheetsService();
    await expect(service.appendRow(mockData)).resolves.not.toThrow();
  });
});
```

### Integration Tests
```typescript
// End-to-end form submission test
describe('Form Submission E2E', () => {
  test('should complete full form workflow', async () => {
    render(<WalkInForm />);
    
    // Step 1
    await userEvent.selectOptions(screen.getByLabelText('Sales ผู้ดูแล'), 'A');
    await userEvent.click(screen.getByText('Next'));
    
    // Step 2  
    await userEvent.type(screen.getByLabelText('ชื่อ-นามสกุล'), 'John Doe');
    await userEvent.type(screen.getByLabelText('หมายเลขโทรศัพท์'), '0999999999');
    await userEvent.click(screen.getByText('Next'));
    
    // ... continue through all steps
    
    // Submit
    await userEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('บันทึกข้อมูลสำเร็จ')).toBeInTheDocument();
    });
  });
});
```

## 📊 Performance Requirements

### Loading Performance
- Initial page load: < 3 seconds
- Form step navigation: < 500ms
- API responses: < 2 seconds
- Bundle size: < 1MB (gzipped)

### Optimization Strategies
```typescript
// Code splitting by route
const WalkInForm = lazy(() => import('./components/WalkInForm'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// Memoization for expensive calculations
const GradeCalculator = memo(({ formData }) => {
  const suggestedGrade = useMemo(() => {
    return calculateGradeFromData(formData);
  }, [formData.budget, formData.decisionTimeframe, formData.followUpCount]);
  
  return <div>Suggested Grade: {suggestedGrade}</div>;
});

// Debounced API calls
const useDebouncedCustomerLookup = () => {
  return useMemo(
    () => debounce((phoneNumber: string) => {
      if (phoneNumber.length >= 9) {
        lookupCustomer(phoneNumber);
      }
    }, 500),
    []
  );
};
```

## 🚀 Deployment & Environment

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_BASE_URL=https://api.walkin-form.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
REACT_APP_ENVIRONMENT=production

# Backend (.env)
PORT=3001
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=https://walkin-form.com
LOG_LEVEL=info
```

### Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend Dockerfile  
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### CI/CD Pipeline (GitHub Actions)
```yaml
name: Deploy Walk-in Form

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run type-check

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.2.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: 'walkin-form-api'
```

## 📋 Project Structure

### Frontend Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Layout/
│   │   ├── Loading/
│   │   ├── ErrorBoundary/
│   │   └── Notification/
│   ├── forms/
│   │   ├── WalkInForm/
│   │   │   ├── WalkInForm.tsx
│   │   │   ├── steps/
│   │   │   │   ├── Step1VisitInfo.tsx
│   │   │   │   ├── Step2CustomerInfo.tsx
│   │   │   │   ├── Step3LocationWork.tsx
│   │   │   │   ├── Step4Preferences.tsx
│   │   │   │   └── Step5Assessment.tsx
│   │   │   ├── components/
│   │   │   │   ├── FormProgress.tsx
│   │   │   │   ├── CustomerLookup.tsx
│   │   │   │   ├── GradeSuggestion.tsx
│   │   │   │   └── AutoFillDialog.tsx
│   │   │   └── hooks/
│   │   │       ├── useWalkInForm.ts
│   │   │       ├── useCustomerLookup.ts
│   │   │       └── useFormValidation.ts
│   │   └── shared/
│   │       ├── FormField.tsx
│   │       ├── DropdownField.tsx
│   │       ├── DatePicker.tsx
│   │       └── PhoneInput.tsx
├── services/
│   ├── api/
│   │   ├── googleSheets.ts
│   │   ├── customer.ts
│   │   └── dropdown.ts
│   ├── auth/
│   │   └── googleAuth.ts
│   └── validation/
│       ├── schemas.ts
│       └── businessRules.ts
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── walkInFormSlice.ts
│   │   ├── dropdownSlice.ts
│   │   └── userSlice.ts
│   └── middleware/
│       ├── persistMiddleware.ts
│       └── errorMiddleware.ts
├── types/
│   ├── walkInForm.ts
│   ├── api.ts
│   └── common.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── formatters.ts
│   └── validators.ts
├── styles/
│   ├── globals.css
│   ├── components/
│   └── themes/
└── __tests__/
    ├── components/
    ├── services/
    ├── utils/
    └── e2e/
```

### Backend Structure
```
server/
├── src/
│   ├── controllers/
│   │   ├── walkInController.ts
│   │   ├── customerController.ts
│   │   └── dropdownController.ts
│   ├── services/
│   │   ├── googleSheets/
│   │   │   ├── GoogleSheetsService.ts
│   │   │   ├── DataMapper.ts
│   │   │   └── ColumnManager.ts
│   │   ├── customer/
│   │   │   ├── CustomerService.ts
│   │   │   ├── DuplicateChecker.ts
│   │   │   └── DataEnricher.ts
│   │   └── validation/
│   │       ├── ValidationService.ts
│   │       └── BusinessRuleEngine.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── routes/
│   │   ├── walkIn.ts
│   │   ├── customer.ts
│   │   └── dropdown.ts
│   ├── models/
│   │   ├── WalkInForm.ts
│   │   ├── Customer.ts
│   │   └── User.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── google.ts
│   │   └── redis.ts
│   └── utils/
│       ├── logger.ts
│       ├── cache.ts
│       └── helpers.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/
│   ├── api.md
│   └── deployment.md
└── scripts/
    ├── deploy.sh
    └── backup.sh
```

## 🔄 API Endpoints Documentation

### Authentication Endpoints
```typescript
// POST /api/auth/google
interface GoogleAuthRequest {
  idToken: string;
}

interface GoogleAuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
```

### Walk-in Form Endpoints
```typescript
// POST /api/walkin/submit
interface WalkInSubmitRequest {
  data: WalkInFormData;
  draft?: boolean;
}

interface WalkInSubmitResponse {
  success: boolean;
  recordId: string;
  rowNumber: number;
  warnings?: string[];
}

// GET /api/walkin/customer-lookup/:phoneNumber
interface CustomerLookupResponse {
  exists: boolean;
  customer?: {
    fullName: string;
    email?: string;
    lineId?: string;
    residenceDistrict?: string;
    workDistrict?: string;
    occupation?: string;
    lastVisit?: Date;
    totalVisits: number;
    grade?: string;
  };
  suggestions?: {
    autoFill: boolean;
    similarCustomers: Array<{
      phoneNumber: string;
      fullName: string;
      similarity: number;
    }>;
  };
}

// GET /api/walkin/drafts/:userId
interface DraftResponse {
  drafts: Array<{
    id: string;
    data: Partial<WalkInFormData>;
    lastModified: Date;
    step: number;
  }>;
}

// DELETE /api/walkin/draft/:draftId
interface DeleteDraftResponse {
  success: boolean;
}
```

### Dropdown Data Endpoints
```typescript
// GET /api/dropdown/options
interface DropdownOptionsResponse {
  salesQueue: DropdownOption[];
  mediaOnline: DropdownOption[];
  mediaOffline: DropdownOption[];
  walkInType: DropdownOption[];
  grade: DropdownOption[];
  districts: DropdownOption[];
  provinces: DropdownOption[];
  occupations: DropdownOption[];
  roomTypes: DropdownOption[];
  lastUpdated: Date;
}

// GET /api/dropdown/refresh
interface RefreshDropdownResponse {
  success: boolean;
  updatedOptions: string[];
  lastRefresh: Date;
}
```

## 🎯 Business Logic Implementation

### Grade Calculation Engine
```typescript
class GradeCalculationEngine {
  calculateSuggestedGrade(data: Partial<WalkInFormData>): string {
    let score = 0;
    const factors = [];
    
    // Budget factor (30% weight)
    if (data.budget) {
      if (data.budget >= 10000000) {
        score += 30;
        factors.push('งบประมาณสูง');
      } else if (data.budget >= 5000000) {
        score += 20;
        factors.push('งบประมาณปานกลาง');
      } else {
        score += 10;
        factors.push('งบประมาณจำกัด');
      }
    }
    
    // Decision timeframe factor (25% weight)
    if (data.decisionTimeframe) {
      switch (data.decisionTimeframe) {
        case 'ภายใน 1 เดือน':
          score += 25;
          factors.push('ตัดสินใจเร็ว');
          break;
        case 'ภายใน 3 เดือน':
          score += 20;
          factors.push('ตัดสินใจปานกลาง');
          break;
        case 'ภายใน 6 เดือน':
          score += 15;
          factors.push('ตัดสินใจช้า');
          break;
        case 'ยังไม่แน่ใจ':
          score += 5;
          factors.push('ยังไม่แน่ใจ');
          break;
      }
    }
    
    // Income factor (20% weight)
    if (data.monthlyIncome) {
      if (data.monthlyIncome >= 100000) {
        score += 20;
        factors.push('รายได้สูง');
      } else if (data.monthlyIncome >= 50000) {
        score += 15;
        factors.push('รายได้ปานกลาง');
      } else {
        score += 10;
        factors.push('รายได้จำกัด');
      }
    }
    
    // Purpose factor (15% weight)
    if (data.purchasePurpose) {
      if (data.purchasePurpose.includes('อยู่เอง')) {
        score += 15;
        factors.push('ซื้อเพื่ออยู่เอง');
      } else if (data.purchasePurpose.includes('ลงทุน')) {
        score += 12;
        factors.push('ซื้อเพื่อลงทุน');
      }
    }
    
    // Interest level factor (10% weight)
    if (data.interests && data.interests.length > 0) {
      score += 10;
      factors.push('มีความสนใจเฉพาะ');
    }
    
    // Determine grade based on score
    if (score >= 80) {
      return 'A (Potential)';
    } else if (score >= 60) {
      return 'B';
    } else if (score >= 40) {
      return 'C';
    } else {
      return 'F';
    }
  }
  
  getGradeReasons(data: Partial<WalkInFormData>): string[] {
    const reasons = [];
    
    if (!data.budget || data.budget < 3000000) {
      reasons.push('งบประมาณอาจไม่เพียงพอ');
    }
    
    if (data.decisionTimeframe === 'ยังไม่แน่ใจ') {
      reasons.push('ยังไม่พร้อมตัดสินใจ');
    }
    
    if (!data.monthlyIncome || data.monthlyIncome < 30000) {
      reasons.push('รายได้อาจไม่เพียงพอสำหรับสินเชื่อ');
    }
    
    if (!data.phoneNumber || !data.email) {
      reasons.push('ข้อมูลการติดต่อไม่ครบถ้วน');
    }
    
    return reasons;
  }
}
```

### Duplicate Detection System
```typescript
class DuplicateDetectionService {
  async checkDuplicateCustomer(phoneNumber: string): Promise<DuplicateCheckResult> {
    // Check exact phone number match
    const exactMatch = await this.findExactMatch(phoneNumber);
    if (exactMatch) {
      return {
        isDuplicate: true,
        confidence: 1.0,
        matchType: 'exact',
        existingCustomer: exactMatch
      };
    }
    
    // Check similar phone numbers (typos, formatting differences)
    const similarMatches = await this.findSimilarMatches(phoneNumber);
    if (similarMatches.length > 0) {
      return {
        isDuplicate: true,
        confidence: 0.8,
        matchType: 'similar',
        existingCustomer: similarMatches[0],
        alternatives: similarMatches
      };
    }
    
    return {
      isDuplicate: false,
      confidence: 0,
      matchType: 'none'
    };
  }
  
  private async findSimilarMatches(phoneNumber: string): Promise<Customer[]> {
    // Remove formatting and normalize
    const normalized = phoneNumber.replace(/[-\s]/g, '');
    
    // Check for common typos and variations
    const variations = [
      normalized,
      normalized.replace(/^0/, '66'),  // International format
      normalized.replace(/^66/, '0'),  // Local format
      this.generateTypoVariations(normalized)
    ].flat();
    
    const customers = await this.customerRepository.findByPhoneVariations(variations);
    
    // Calculate similarity scores
    return customers.map(customer => ({
      ...customer,
      similarity: this.calculatePhoneSimilarity(phoneNumber, customer.phoneNumber)
    })).filter(c => c.similarity > 0.7);
  }
  
  private calculatePhoneSimilarity(phone1: string, phone2: string): number {
    // Levenshtein distance algorithm for string similarity
    const matrix = [];
    const len1 = phone1.length;
    const len2 = phone2.length;
    
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (phone2.charAt(i - 1) === phone1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const distance = matrix[len2][len1];
    const maxLength = Math.max(len1, len2);
    
    return 1 - (distance / maxLength);
  }
}
```

## 📊 Analytics & Monitoring

### Google Analytics Integration
```typescript
// Analytics events tracking
class AnalyticsService {
  trackFormStep(step: number, stepName: string) {
    gtag('event', 'form_step_completed', {
      event_category: 'walk_in_form',
      event_label: stepName,
      value: step
    });
  }
  
  trackFormSubmission(formData: WalkInFormData) {
    gtag('event', 'form_submission', {
      event_category: 'walk_in_form',
      event_label: formData.grade,
      custom_parameters: {
        sales_queue: formData.salesQueue,
        walk_in_type: formData.walkInType,
        customer_grade: formData.grade
      }
    });
  }
  
  trackValidationError(field: string, error: string) {
    gtag('event', 'validation_error', {
      event_category: 'form_validation',
      event_label: field,
      custom_parameters: {
        error_message: error
      }
    });
  }
  
  trackCustomerLookup(phoneNumber: string, found: boolean) {
    gtag('event', 'customer_lookup', {
      event_category: 'customer_data',
      event_label: found ? 'found' : 'not_found',
      custom_parameters: {
        phone_length: phoneNumber.length
      }
    });
  }
}
```

### Error Monitoring with Sentry
```typescript
import * as Sentry from '@sentry/react';

// Error boundary configuration
const ErrorBoundary = Sentry.withErrorBoundary(WalkInForm, {
  fallback: ({ error, resetError }) => (
    <div className="error-fallback">
      <h2>เกิดข้อผิดพลาด</h2>
      <p>ระบบประสบปัญหาชั่วคราว กรุณาลองใหม่อีกครั้ง</p>
      <button onClick={resetError}>ลองใหม่</button>
      <details>
        <summary>รายละเอียดข้อผิดพลาด</summary>
        <pre>{error.message}</pre>
      </details>
    </div>
  ),
  beforeCapture: (scope, error) => {
    scope.setTag('component', 'WalkInForm');
    scope.setLevel('error');
  }
});

// Custom error tracking
const trackFormError = (error: Error, context: any) => {
  Sentry.withScope((scope) => {
    scope.setTag('errorType', 'form_submission');
    scope.setContext('formData', context);
    scope.setLevel('error');
    Sentry.captureException(error);
  });
};
```

### Performance Monitoring
```typescript
// Performance tracking
class PerformanceMonitor {
  trackFormLoad() {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      
      gtag('event', 'timing_complete', {
        name: 'form_load',
        value: Math.round(loadTime)
      });
      
      if (loadTime > 3000) {
        console.warn('Form load time exceeded 3 seconds:', loadTime);
      }
    };
  }
  
  trackStepNavigation(fromStep: number, toStep: number) {
    const startTime = performance.now();
    
    return () => {
      const navigationTime = performance.now() - startTime;
      
      gtag('event', 'step_navigation', {
        event_category: 'form_performance',
        custom_parameters: {
          from_step: fromStep,
          to_step: toStep,
          duration: Math.round(navigationTime)
        }
      });
    };
  }
  
  trackAPICall(endpoint: string, method: string) {
    const startTime = performance.now();
    
    return (success: boolean) => {
      const duration = performance.now() - startTime;
      
      gtag('event', 'api_call', {
        event_category: 'api_performance',
        custom_parameters: {
          endpoint,
          method,
          duration: Math.round(duration),
          success
        }
      });
      
      if (duration > 5000) {
        Sentry.captureMessage(`Slow API call: ${endpoint}`, 'warning');
      }
    };
  }
}
```

## 🔧 Development Guidelines

### Code Style & Standards
```typescript
// ESLint configuration
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};

// Prettier configuration
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2
};
```

### Git Workflow
```bash
# Branch naming convention
feature/walkin-form-step1
bugfix/phone-validation-error
hotfix/form-submission-failure

# Commit message format
type(scope): subject

feat(form): add customer lookup functionality
fix(validation): resolve phone number format issue
docs(api): update endpoint documentation
test(form): add unit tests for validation
```

### Code Review Checklist
```markdown
## Code Review Checklist

### Functionality
- [ ] Code meets requirements
- [ ] All edge cases handled
- [ ] Error handling implemented
- [ ] Loading states managed

### Performance
- [ ] No unnecessary re-renders
- [ ] API calls optimized
- [ ] Bundle size impact minimal
- [ ] Memory leaks avoided

### Security
- [ ] Input validation implemented
- [ ] XSS prevention measures
- [ ] Authentication checks
- [ ] Sensitive data protected

### Testing
- [ ] Unit tests written
- [ ] Integration tests pass
- [ ] E2E scenarios covered
- [ ] Error scenarios tested

### Code Quality
- [ ] TypeScript types defined
- [ ] Code is readable
- [ ] No code duplication
- [ ] Following conventions
```

## 📚 Documentation Requirements

### API Documentation
```typescript
/**
 * Submit walk-in customer form data
 * 
 * @route POST /api/walkin/submit
 * @param {WalkInFormData} data - Form data to submit
 * @param {boolean} draft - Whether this is a draft save
 * @returns {Promise<WalkInSubmitResponse>} Submission result
 * 
 * @example
 * ```typescript
 * const response = await submitWalkInForm({
 *   salesQueue: 'A',
 *   visitDate: new Date(),
 *   walkInType: 'Appointment',
 *   fullName: 'John Doe',
 *   phoneNumber: '0999999999',
 *   grade: 'A (Potential)'
 * });
 * ```
 * 
 * @throws {ValidationError} When form data is invalid
 * @throws {DuplicateError} When customer already exists
 * @throws {APIError} When Google Sheets API fails
 */
export async function submitWalkInForm(
  data: WalkInFormData, 
  draft: boolean = false
): Promise<WalkInSubmitResponse>
```

### User Documentation
```markdown
# Walk-in Form User Guide

## เริ่มต้นใช้งาน

### การเข้าสู่ระบบ
1. เปิดเว็บไซต์ Walk-in Form
2. คลิกปุ่ม "เข้าสู่ระบบด้วย Google"
3. เลือกบัญชี Google ที่ได้รับอนุญาต
4. รอการยืนยันสิทธิ์การเข้าถึง

### การกรอกฟอร์ม

#### ขั้นตอนที่ 1: ข้อมูลการเข้าชม
- **วันที่เข้าชมโครงการ**: เลือกวันที่ลูกค้าเข้าชมจริง
- **Sales ผู้ดูแล**: เลือกชื่อ Sales ที่ดูแลลูกค้า
- **ประเภท Walk-in**: เลือกว่าลูกค้านัดหมายหรือเดินผ่านมา

#### ขั้นตอนที่ 2: ข้อมูลลูกค้า
- **ชื่อ-นามสกุล**: กรอกชื่อเต็มของลูกค้า
- **หมายเลขโทรศัพท์**: กรอกเบอร์โทร (ระบบจะตรวจสอบลูกค้าเดิม)
- **Email และ Line ID**: ข้อมูลเสริมสำหรับการติดต่อ

### เคล็ดลับการใช้งาน
- กดปุ่ม "Save Draft" เพื่อบันทึกข้อมูลชั่วคราว
- ระบบจะแนะนำ Grade ตามข้อมูลที่กรอก
- หากพบลูกค้าเดิม ระบบจะแสดงตัวเลือกในการใช้ข้อมูลเก่า
```

---

## 📞 Support & Maintenance

### Support Contacts
- **Technical Issues**: dev-support@company.com
- **Business Logic**: business-analyst@company.com  
- **User Training**: user-training@company.com

### Maintenance Schedule
- **Regular Updates**: Weekly (Sundays 2:00-4:00 AM)
- **Security Patches**: As needed
- **Feature Releases**: Monthly
- **Data Backup**: Daily automatic backup

### Issue Escalation Process
1. **Level 1**: User reports issue via form
2. **Level 2**: Technical support investigation
3. **Level 3**: Development team involvement
4. **Level 4**: Business stakeholder decision

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Next Review Date: [Date + 3 months]*