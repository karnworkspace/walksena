
import React, { useEffect } from 'react';
import { Form, Button, Steps, Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { RootState, AppDispatch } from '../../../store';
import { setCurrentStep, updateFormData, clearForm } from '../../../store/slices/walkInFormSlice';
import { convertFormDatesForAPI } from '../../../utils/dateUtils';
import Step1VisitInfo from './steps/Step1VisitInfo';
import Step2CustomerInfo from './steps/Step2CustomerInfo';
import Step3LocationWork from './steps/Step3LocationWork';
import Step4Preferences from './steps/Step4Preferences';
import Step5Assessment from './steps/Step5Assessment';

const { Step } = Steps;

const steps = [
  { title: 'Visit Information', content: <Step1VisitInfo /> },
  { title: 'Customer Information', content: <Step2CustomerInfo /> },
  { title: 'Location & Work', content: <Step3LocationWork /> },
  { title: 'Preferences & Requirements', content: <Step4Preferences /> },
  { title: 'Assessment & Follow-up', content: <Step5Assessment /> },
];

const WalkInForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useSelector((state: RootState) => state.walkInForm.currentStep);
  const formData = useSelector((state: RootState) => state.walkInForm.formData);
  const isEditMode = useSelector((state: RootState) => state.walkInForm.isEditMode);
  const isViewMode = useSelector((state: RootState) => state.walkInForm.isViewMode);
  const editingRecordId = useSelector((state: RootState) => state.walkInForm.editingRecordId);
  const [form] = Form.useForm();

  useEffect(() => {
    // Don't process dates here - let the form handle them naturally
    const processedFormData: any = { ...formData };
    
    console.log('Original form data:', formData);
    console.log('Setting form values:', processedFormData);
    
    // Set form values directly without date conversion
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

  const next = () => {
    form.validateFields()
      .then(() => {
        dispatch(setCurrentStep(currentStep + 1));
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const prev = () => {
    dispatch(setCurrentStep(currentStep - 1));
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

          const response = await axios.post('http://localhost:3001/api/walkin/submit', finalData);

          if (response.data.success) {
            const message = isDraft ? 
              'Draft saved successfully! You can continue later.' : 
              (isEditMode ? 'Record updated successfully!' : 'Form submitted successfully!');
            alert(message);
            
            if (!isDraft) {
              dispatch(clearForm());
              form.resetFields();
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

  return (
    <Card 
      title={
        <div>
          <div style={{ color: isEditMode ? '#ff7a00' : isViewMode ? '#52c41a' : '#1890ff', fontWeight: 'bold' }}>
            {isEditMode ? `🔧 Edit Record #${editingRecordId}` : 
             isViewMode ? `👁️ View Record #${editingRecordId}` : 
             '📝 New Walk-in Form'}
          </div>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </div>
        </div>
      } 
      className="form-card"
    >
      <Steps 
        current={currentStep} 
        size="small" 
        responsive
        onChange={isViewMode ? (step) => dispatch(setCurrentStep(step)) : undefined}
        style={{ cursor: isViewMode ? 'pointer' : 'default' }}
      >
        {steps.map((item, index) => (
          <Step 
            key={item.title} 
            title={`${index + 1}`} 
            description={window.innerWidth > 768 ? item.title : undefined}
            style={{ 
              cursor: isViewMode ? 'pointer' : 'default'
            }}
          />
        ))}
      </Steps>
      <div className="steps-content">
        <Form 
          form={form} 
          layout="vertical" 
          autoComplete="off" 
          onValuesChange={handleValuesChange} 
          initialValues={formData}
          size="large"
          disabled={isViewMode}
        >
          {steps[currentStep].content}
        </Form>
      </div>
      <div className="steps-action">
        <div>
          {(isEditMode || isViewMode) && (
            <Button 
              size="large" 
              onClick={() => {
                dispatch(clearForm());
                form.resetFields();
              }}
            >
              {isViewMode ? '← Back to List' : '✕ Cancel Edit'}
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep > 0 && !isViewMode && (
            <Button size="large" onClick={prev}>
              ← Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" size="large" onClick={isViewMode ? next : next}>
              {isViewMode ? 'Next →' : 'Next →'}
            </Button>
          )}
          {!isViewMode && (
            <Button 
              size="large" 
              onClick={handleSaveDraft}
              style={{ marginRight: '8px' }}
            >
              💾 Save Draft
            </Button>
          )}
          {currentStep === steps.length - 1 && !isViewMode && (
            <Button type="primary" size="large" onClick={() => handleSubmit(false)}>
              {isEditMode ? '💾 Update Record' : '✓ Submit Form'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WalkInForm;
