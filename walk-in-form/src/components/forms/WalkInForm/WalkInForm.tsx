
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Steps, Divider, Modal, Descriptions } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_BASE, SHOW_FORM_ACTIONS } from '../../../config';
import { RootState, AppDispatch } from '../../../store';
import { setCurrentStep, updateFormData, clearForm } from '../../../store/slices/walkInFormSlice';
import { convertFormDatesForAPI, safeParseDate } from '../../../utils/dateUtils';
import Step1VisitInfo from './steps/Step1VisitInfo';
import Step2CustomerInfo from './steps/Step2CustomerInfo';
import Step3LocationWork from './steps/Step3LocationWork';
import Step4Preferences from './steps/Step4Preferences';
import Step5Assessment from './steps/Step5Assessment';

const { Step } = Steps;

const steps = [
  { 
    id: 'step1', 
    title: 'Visit Information', 
    content: <Step1VisitInfo />,
    description: 'วันที่เข้าชม, Sales Queue, ประเภท Walk-in'
  },
  { 
    id: 'step2', 
    title: 'Customer Information', 
    content: <Step2CustomerInfo />,
    description: 'ชื่อ-นามสกุล, เบอร์โทร, อีเมล, Line ID'
  },
  { 
    id: 'step3', 
    title: 'Location & Work', 
    content: <Step3LocationWork />,
    description: 'ที่อยู่อาศัย, ที่ทำงาน, อาชีพ, รายได้'
  },
  { 
    id: 'step4', 
    title: 'Preferences & Requirements', 
    content: <Step4Preferences />,
    description: 'ประเภทห้อง, งบประมาณ, ปัจจัยตัดสินใจ'
  },
  { 
    id: 'step5', 
    title: 'Assessment & Follow-up', 
    content: <Step5Assessment />,
    description: 'Grade, Status, การติดตาม'
  },
];

interface WalkInFormProps {
  onSubmitted?: () => void;
  onHome?: () => void;
}

const WalkInForm: React.FC<WalkInFormProps> = ({ onSubmitted, onHome }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useSelector((state: RootState) => state.walkInForm.currentStep);
  const formData = useSelector((state: RootState) => state.walkInForm.formData);
  const isEditMode = useSelector((state: RootState) => state.walkInForm.isEditMode);
  const isViewMode = useSelector((state: RootState) => state.walkInForm.isViewMode);
  const editingRecordId = useSelector((state: RootState) => state.walkInForm.editingRecordId);
  const [form] = Form.useForm();
  
  // Refs for smooth scrolling
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [aiVisible, setAiVisible] = useState(false);

  useEffect(() => {
    const processedFormData: any = { ...formData };

    // Convert visitDate string -> dayjs for DatePicker display
    if (typeof processedFormData.visitDate === 'string') {
      const d = safeParseDate(processedFormData.visitDate);
      processedFormData.visitDate = d || null;
    }

    console.log('Original form data:', formData);
    console.log('Setting form values:', processedFormData);

    form.setFieldsValue(processedFormData);
  }, [formData, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.latestStatus) {
      const status = changedValues.latestStatus;
      const nonBookingReasons = [
        'เทียบโครงการอื่น',
        'ปรึกษาครอบครัว',
        'ชะลอการซื้อ',
        'Dead - เปลี่ยนทำเล',
        'Dead - ไม่สนใจแล้ว',
        'Dead - ไม่ชอบรูปแบบโครงการ/เปลี่ยนใจซื้อบ้าน',
        'Dead - ซื้อที่อื่น',
        'Dead - เกินงบ',
        'Dead - คล้าย Survey',
        'Dead - เบอร์โทรติดต่อไม่ได้แล้ว',
        'Dead - ไม่ชอบ Auto Park',
        'ดูเฉยๆ ยังไม่มีแผนซื้อในปี 2568',
        'ระยะเวลาการก่อสร้างที่นานเกินไป',
        'คาดว่าติดปัญหาทางการเงิน',
        'กังวลเรื่องสินเชื่อ',
        'ดูเฉยๆไม่ได้มีแผนจะซื้อ'
      ];

      if (nonBookingReasons.includes(status)) {
        form.setFieldsValue({ reasonNotBooking: status });
        dispatch(updateFormData({ ...allValues, reasonNotBooking: status }));
      } else {
        dispatch(updateFormData(allValues));
      }
    } else {
      dispatch(updateFormData(allValues));
    }
  };

  // Scroll to section function
  const scrollToSection = (sectionIndex: number) => {
    const section = sectionRefs.current[sectionIndex];
    if (section && containerRef.current) {
      const containerTop = containerRef.current.offsetTop;
      const sectionTop = section.offsetTop;
      const offset = 120; // Account for sticky header
      
      window.scrollTo({
        top: containerTop + sectionTop - offset,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionIndex);
      dispatch(setCurrentStep(sectionIndex));
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const containerTop = containerRef.current.offsetTop;
      const scrollPos = window.scrollY + 150; // Offset for better detection
      
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[i];
        if (section && (containerTop + section.offsetTop) <= scrollPos) {
          if (activeSection !== i) {
            setActiveSection(i);
            dispatch(setCurrentStep(i));
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, dispatch]);

  const next = () => {
    form.validateFields()
      .then(() => {
        const nextStep = Math.min(currentStep + 1, steps.length - 1);
        scrollToSection(nextStep);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const prev = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    scrollToSection(prevStep);
  };

  const handleSubmit = (isDraft = false) => {
    const validateFields = isDraft ? Promise.resolve(form.getFieldsValue()) : form.validateFields();
    
    validateFields
      .then(async (values) => {
        try {
          // Combine all data from Redux store
          const combinedData = { ...formData, ...values };
          
          // Add draft status and completion info
          const submissionData = {
            ...combinedData,
            isDraft: isDraft,
            completedSteps: currentStep + 1,
            lastUpdated: new Date().toISOString(),
            latestStatus: isDraft ? 'Draft - In Progress' : (combinedData.latestStatus || 'New')
          };
          
          // Convert dates for API submission
          const finalData = convertFormDatesForAPI(submissionData);
          console.log('Submitting data:', finalData, 'isDraft:', isDraft);

          // Include running number when editing (robust extraction)
          if (isEditMode) {
            const candidateNoValues = [
              (finalData as any).no,
              (formData as any)?.no,
              editingRecordId,
              (finalData as any).runningNumber,
              (formData as any)?.runningNumber,
            ].filter(Boolean);

            let parsedNo: number | undefined;
            for (const cand of candidateNoValues) {
              const n = parseInt(String(cand), 10);
              if (!isNaN(n)) { parsedNo = n; break; }
            }

            if (parsedNo !== undefined) {
              (finalData as any).no = parsedNo;
            } else {
              alert('ไม่พบหมายเลขแถว (No.) ของรายการที่กำลังแก้ไข กรุณาเปิดแก้ไขจากหน้ารายการอีกครั้ง');
              return;
            }
          }

          const endpoint = isEditMode 
            ? `${API_BASE}/api/walkin/update`
            : `${API_BASE}/api/walkin/submit`;

          const response = await axios.post(endpoint, finalData);

          if (response.data.success) {
            const message = isDraft ? 
              'Draft saved successfully! You can continue later.' : 
              (isEditMode ? 'Record updated successfully!' : 'Form submitted successfully!');
            alert(message);
            
            if (!isDraft) {
              dispatch(clearForm());
              form.resetFields();
              // After successful non-draft submission, navigate back if provided
              if (typeof onSubmitted === 'function') {
                onSubmitted();
              }
            }
          } else {
            alert(`${isDraft ? 'Draft save' : (isEditMode ? 'Update' : 'Submission')} failed: ${response.data.message}`);
          }
        } catch (error) {
          console.error('Failed to submit form:', error);
          alert('An error occurred while submitting the form.');
        }
      })
      .catch(info => {
        if (!isDraft) {
          console.log('Validate Failed:', info);
        } else {
          // For draft, still try to save even with validation errors
          handleSubmit(true);
        }
      });
  };
  
  const handleSaveDraft = () => {
    handleSubmit(true);
  };

  // Compose header title with record number and customer name when editing/viewing
  const makeHeaderTitle = () => {
    const id = editingRecordId || (formData?.no ? String(formData.no) : '');
    const name = (form.getFieldValue('fullName') || formData?.fullName || '').toString().trim();
    if (isEditMode) return `🔧 Edit #${id}${name ? ' — ' + name : ''}`;
    if (isViewMode) return `👁️ View #${id}${name ? ' — ' + name : ''}`;
    return '📝 New Walk-in Form';
  };

  return (
    <div className="single-page-form">
      {/* Sticky Header */}
      <div className="form-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ color: isEditMode ? '#ff7a00' : isViewMode ? '#52c41a' : '#1890ff', fontWeight: 'bold', fontSize: '20px' }}>
              {makeHeaderTitle()}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
              {steps[currentStep].description}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Keep AI summary button visible in edit mode regardless of flag */}
            {isEditMode && (
              <Button 
                onClick={() => setAiVisible(true)}
                style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
              >
                ผลการสรุปจาก AI
              </Button>
            )}

            {/* Other actions can be toggled via flag */}
            {SHOW_FORM_ACTIONS && (
              <>
                {(isEditMode || isViewMode) && (
                  <Button 
                    onClick={() => {
                      dispatch(clearForm());
                      form.resetFields();
                    }}
                  >
                    {isViewMode ? '← Back to List' : '✕ Cancel Edit'}
                  </Button>
                )}
                {!isViewMode && (
                  <Button 
                    onClick={handleSaveDraft}
                    icon="💾"
                  >
                    Save Draft
                  </Button>
                )}
                {!isViewMode && (
                  <Button 
                    type="primary" 
                    onClick={() => handleSubmit(false)}
                    icon="✓"
                  >
                    {isEditMode ? 'Update Record' : 'Submit Form'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Progress Steps */}
        <Steps 
          current={activeSection} 
          size="small" 
          responsive
          onChange={(step) => scrollToSection(step)}
          style={{ cursor: 'pointer' }}
        >
          {steps.map((item, index) => (
            <Step 
              key={item.id} 
              title={`${index + 1}`} 
              description={window.innerWidth > 768 ? item.title : undefined}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Steps>
      </div>

      {/* Form Content */}
      <div ref={containerRef} className="form-content" style={{ padding: '24px' }}>
        <Form 
          form={form} 
          layout="vertical" 
          autoComplete="off" 
          onValuesChange={handleValuesChange} 
          size="large"
          disabled={isViewMode}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className="form-section"
              style={{
                marginBottom: '48px',
                padding: '24px',
                background: '#fff',
                borderRadius: '8px',
                border: activeSection === index ? '2px solid #1890ff' : '1px solid #f0f0f0',
                boxShadow: activeSection === index ? '0 4px 16px rgba(24, 144, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  margin: 0,
                  color: activeSection === index ? '#1890ff' : '#262626',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {index + 1}. {step.title}
                </h3>
                <p style={{
                  margin: '8px 0 0 0',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  {step.description}
                </p>
              </div>
              
              {step.content}
              
              {index < steps.length - 1 && (
                <Divider style={{ margin: '32px 0 0 0' }} />
              )}
            </div>
          ))}
        </Form>
      </div>

      {/* Floating Footer Controls */}
      <div className="floating-nav" style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        background: '#7fd2c7',
        border: 'none',
        borderRadius: 999,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        zIndex: 4000
      }}>
        {/* Cancel */}
        {(isEditMode || isViewMode) && (
          <Button 
            onClick={() => {
              dispatch(clearForm());
              form.resetFields();
              if (typeof onHome === 'function') onHome();
            }}
          >
            ✕ Cancel
          </Button>
        )}

        {/* AI Summary (between Cancel and Save) */}
        {(isEditMode || isViewMode) && (
          <Button
            onClick={() => setAiVisible(true)}
            style={{ background: '#ffffff', borderColor: '#ffffff' }}
          >
            AI
          </Button>
        )}

        {/* Save (Update/Submit) - only when editing and not in view-only mode */}
        {isEditMode && !isViewMode && (
          <Button 
            type="primary"
            onClick={() => handleSubmit(false)}
          >
            Save
          </Button>
        )}
      </div>

      {/* AI Summary Modal */}
      <Modal
        title="ผลการสรุปจาก AI"
        open={aiVisible}
        onCancel={() => setAiVisible(false)}
        centered={false}
        width="90vw"
        style={{ top: 140 }}
        zIndex={5000}
        wrapClassName="ai-modal"
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto', padding: 16 }}
        maskStyle={{ backdropFilter: 'blur(2px)' }}
        footer={[
          <Button key="close" type="primary" onClick={() => setAiVisible(false)}>ปิด</Button>
        ]}
      >
        <Form.Item noStyle shouldUpdate>
          {() => {
            // Use "true" to get all values, including unregistered ones (aiStatus/aiObjective/aiCause/aiDetail)
            const values = form.getFieldsValue(true);
            const aiStatus = values.aiStatus || '—';
            const aiObjective = values.aiObjective || '—';
            const aiCause = values.aiCause || '—';
            const aiDetail = values.aiDetail || values.customerDetails || '—';
            return (
              <Descriptions column={1} size="middle" bordered>
                <Descriptions.Item label="สถานะ">{aiStatus}</Descriptions.Item>
                <Descriptions.Item label="วัตถุประสงค์">{aiObjective}</Descriptions.Item>
                <Descriptions.Item label="สาเหตุ">{aiCause}</Descriptions.Item>
                <Descriptions.Item label="รายละเอียด">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{aiDetail}</div>
                </Descriptions.Item>
              </Descriptions>
            );
          }}
        </Form.Item>
      </Modal>
    </div>
  );
};

export default WalkInForm;
