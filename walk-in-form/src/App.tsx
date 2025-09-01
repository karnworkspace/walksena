import React, { useState } from 'react';
import { ConfigProvider, Button, Typography, Input } from 'antd';
import { useDispatch } from 'react-redux';
import WalkInForm from './components/forms/WalkInForm/WalkInForm';
import WalkInList from './components/list/WalkInList';
import { SHOW_CREATE_BUTTON } from './config';
import { setEditMode, setViewMode, clearForm } from './store/slices/walkInFormSlice';
import { convertGoogleSheetsToFormData } from './utils/dataConverter';
import { AppDispatch } from './store';
import senaLogo from './assets/sena logo.png';
import 'antd/dist/reset.css';
import './App.css';

const { Title } = Typography;

const App: React.FC = () => {
  // Default landing view switched to list as requested
  const [view, setView] = useState('list');
  const dispatch = useDispatch<AppDispatch>();
  const [entriesTotal, setEntriesTotal] = useState<number>(0);
  const [entriesShowing, setEntriesShowing] = useState<number>(0);
  const [query, setQuery] = useState<string>('');

  // Helper to pick AI fields like AI1-AI4 robustly (tolerate spaces/case)
  const pickAI = (obj: any, target: string) => {
    if (!obj) return undefined;
    const wanted = target.toUpperCase();
    for (const key of Object.keys(obj)) {
      const norm = String(key).replace(/\s+/g, '').toUpperCase();
      if (norm === wanted) return (obj as any)[key];
    }
    return undefined;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // Customize theme for better mobile/tablet experience
          borderRadius: 6,
          controlHeight: 48,
          fontSize: 16,
        },
      }}
    >
      <div className="App">
        <div className="main-container">
          <div className="app-header">
            <div className="header-left">
              <img src={senaLogo} alt="SENA Logo" className="sena-logo" />
              <Title level={2} className="app-title">
                {view === 'form' ? 'Walk-in Form 2025' : `Walk-in Records ${entriesTotal ? `(${entriesTotal} entries)` : ''}`}
              </Title>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Super Search */}
              {view !== 'form' && (
                <Input
                  allowClear
                  size="large"
                  placeholder="ใส่ชื่อ หรือ หมายเลขโทรศัพท์เพื่อค้นหา"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: 320 }}
                />
              )}
              <Button 
                type={view === 'list' ? 'primary' : 'default'} 
                size="large" 
                onClick={() => setView('list')}
              >
                📋 View List
              </Button>
              {SHOW_CREATE_BUTTON && (
                <Button 
                  type={view === 'form' ? 'primary' : 'default'} 
                  size="large" 
                  onClick={() => {
                    // clear any edit/view state and start a fresh form
                    dispatch(clearForm());
                    setView('form');
                  }}
                >
                  📝 Create New Customer
                </Button>
              )}
            </div>
          </div>
          {view === 'form' ? (
            <WalkInForm onSubmitted={() => setView('list')} onHome={() => setView('list')} />
          ) : (
            <WalkInList 
              query={query}
              onCountChange={(total, showing) => {
                if (typeof total === 'number') setEntriesTotal(total);
                if (typeof showing === 'number') setEntriesShowing(showing);
              }}
              onEdit={(record) => {
                try {
                  console.log('Edit clicked for record:', record);
                  
                  // Convert Google Sheets data to form format
                  const formData = convertGoogleSheetsToFormData(record);
                  
                  console.log('Converted form data:', formData);
                  
                  // Remove null/undefined values and problematic data that might cause issues
                  const cleanFormData = Object.keys(formData).reduce((acc, key) => {
                    const value = formData[key];
                    
                    // Skip null, undefined, empty strings
                    if (value === null || value === undefined || value === '') {
                      return acc;
                    }
                    
                    // Handle arrays (interests, shoppingMalls, etc.)
                    if (Array.isArray(value)) {
                      if (value.length > 0) {
                        acc[key] = value;
                      }
                      return acc;
                    }
                    
                    // Handle dates - keep as strings for now
                    if (key === 'visitDate' || key.includes('Date')) {
                      if (typeof value === 'string' && value.trim() !== '') {
                        acc[key] = value.trim();
                      }
                      return acc;
                    }
                    
                    // Handle numbers
                    if (typeof value === 'number' && !isNaN(value)) {
                      acc[key] = value;
                      return acc;
                    }
                    
                    // Handle strings
                    if (typeof value === 'string' && value.trim() !== '') {
                      acc[key] = value.trim();
                      return acc;
                    }
                    
                    return acc;
                  }, {} as any);
                  
                  console.log('Clean form data:', cleanFormData);
                  
                  // Derive running number (robust across header variants)
                  const runningNo =
                    String(
                      record['No.'] ||
                      (formData as any).no ||
                      record['No'] ||
                      record['NO'] ||
                      record['no'] ||
                      record['Running Number'] ||
                      record['RunningNo'] ||
                      ''
                    ).trim();

                  // Extract optional AI summary fields from the row (best-effort mapping)
                  const aiStatus = pickAI(record, 'AI1');      // สถานะ
                  const aiObjective = pickAI(record, 'AI2');   // วัตถุประสงค์
                  const aiCause = pickAI(record, 'AI3');       // สาเหตุ
                  const aiDetail = pickAI(record, 'AI4');      // รายละเอียด

                  if (aiStatus) (cleanFormData as any).aiStatus = aiStatus;
                  if (aiObjective) (cleanFormData as any).aiObjective = aiObjective;
                  if (aiCause) (cleanFormData as any).aiCause = aiCause;
                  if (aiDetail) (cleanFormData as any).aiDetail = aiDetail;

                  // Attach running number into form data as well
                  const parsedNo = parseInt(runningNo, 10);
                  if (!isNaN(parsedNo)) {
                    (cleanFormData as any).no = parsedNo;
                  }

                  // Set edit mode with the converted data
                  dispatch(setEditMode({
                    isEdit: true,
                    recordId: runningNo || undefined,
                    formData: cleanFormData
                  }));
                  
                  // Switch to form view
                  setView('form');
                } catch (error) {
                  console.error('Error in edit handler:', error);
                  alert('Error loading data for editing. Please try again.');
                }
              }}
              onView={(record) => {
                try {
                  console.log('View clicked for record:', record);
                  
                  // Convert Google Sheets data to form format
                  const formData = convertGoogleSheetsToFormData(record);
                  
                  console.log('Converted form data for view:', formData);
                  
                  // Remove null/undefined values
                  const cleanFormData = Object.keys(formData).reduce((acc, key) => {
                    const value = formData[key];
                    
                    if (value === null || value === undefined || value === '') {
                      return acc;
                    }
                    
                    if (Array.isArray(value)) {
                      if (value.length > 0) {
                        acc[key] = value;
                      }
                      return acc;
                    }
                    
                    if (key === 'visitDate' || key.includes('Date')) {
                      if (typeof value === 'string' && value.trim() !== '') {
                        acc[key] = value.trim();
                      }
                      return acc;
                    }
                    
                    if (typeof value === 'number' && !isNaN(value)) {
                      acc[key] = value;
                      return acc;
                    }
                    
                    if (typeof value === 'string' && value.trim() !== '') {
                      acc[key] = value.trim();
                      return acc;
                    }
                    
                    return acc;
                  }, {} as any);
                  
                  console.log('Clean form data for view:', cleanFormData);
                  
                  // Derive running number (robust across header variants)
                  const runningNo =
                    String(
                      record['No.'] ||
                      (formData as any).no ||
                      record['No'] ||
                      record['NO'] ||
                      record['no'] ||
                      record['Running Number'] ||
                      record['RunningNo'] ||
                      ''
                    ).trim();

                  // Extract optional AI summary fields from the row (best-effort mapping)
                  const aiStatus = pickAI(record, 'AI1');
                  const aiObjective = pickAI(record, 'AI2');
                  const aiCause = pickAI(record, 'AI3');
                  const aiDetail = pickAI(record, 'AI4');

                  if (aiStatus) (cleanFormData as any).aiStatus = aiStatus;
                  if (aiObjective) (cleanFormData as any).aiObjective = aiObjective;
                  if (aiCause) (cleanFormData as any).aiCause = aiCause;
                  if (aiDetail) (cleanFormData as any).aiDetail = aiDetail;

                  const parsedNo = parseInt(runningNo, 10);
                  if (!isNaN(parsedNo)) {
                    (cleanFormData as any).no = parsedNo;
                  }

                  // Set view mode with the converted data
                  dispatch(setViewMode({
                    recordId: runningNo || undefined,
                    formData: cleanFormData
                  }));
                  
                  // Switch to form view
                  setView('form');
                } catch (error) {
                  console.error('Error in view handler:', error);
                  alert('Error loading data for viewing. Please try again.');
                }
              }}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
