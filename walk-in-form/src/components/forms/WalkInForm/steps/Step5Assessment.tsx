
import React from 'react';
import { Form, Input, DatePicker, Button, Space, Card, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

// Grade options
const gradeOptions = [
  'A (Potential)',
  'B',
  'C',
  'F'
];

// Reusable single-select clickable list (same style as Step 4)
const ClickableList: React.FC<{
  title: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ title, options, value, onChange, placeholder }) => (
  <Card 
    size="small" 
    style={{ 
      borderRadius: '8px',
      border: value ? '2px solid #1890ff' : '1px solid #d9d9d9'
    }}
  >
    <div style={{ marginBottom: '12px' }}>
      <Text strong style={{ color: '#1890ff' }}>
        {title}
      </Text>
      {placeholder && !value && (
        <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
          ({placeholder})
        </Text>
      )}
    </div>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '8px'
    }}>
      {options?.map(option => (
        <div
          key={option}
          onClick={() => onChange(option)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: value === option ? '2px solid #1890ff' : '1px solid #e0e0e0',
            backgroundColor: value === option ? '#f0f8ff' : '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            if (value !== option) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#1890ff';
            }
          }}
          onMouseLeave={(e) => {
            if (value !== option) {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }
          }}
        >
          {option}
        </div>
      ))}
    </div>
  </Card>
);

const latestStatusOptions = [
  'Win - Book',
  'Prospect',
  'เก็บข้อมูล',
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

const Step5Assessment: React.FC = () => {
  return (
    <div>
      <Form.Item
        label="Grade"
        name="grade"
        rules={[{ required: true, message: 'กรุณาเลือก Grade' }]}
      >
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือก Grade"
              options={gradeOptions}
              value={getFieldValue('grade')}
              onChange={(value) => setFieldsValue({ grade: value })}
              placeholder="เลือกได้ 1 รายการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="สถานะล่าสุด" name="latestStatus">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกสถานะล่าสุด"
              options={latestStatusOptions}
              value={getFieldValue('latestStatus')}
              onChange={(value) => setFieldsValue({ latestStatus: value })}
              placeholder="เลือกได้ 1 รายการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="รายละเอียดลูกค้า" name="customerDetails">
        <TextArea rows={4} placeholder="กรอกรายละเอียดเพิ่มเติมเกี่ยวกับลูกค้า" />
      </Form.Item>

      <Form.Item label="เหตุผลที่ไม่จอง" name="reasonNotBooking">
        <TextArea rows={4} placeholder="กรอกเหตุผลที่ลูกค้ายังไม่ตัดสินใจจอง" />
      </Form.Item>

      <Form.List name="followUps">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '240px 1fr 24px',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  width: '100%'
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'date']}
                  rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
                  style={{ margin: 0 }}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="วันที่ดำเนินการติดตาม" format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'detail']}
                  rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{ width: '100%' }} placeholder="รายละเอียดการติดตาม" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 16, color: '#999' }} />
              </div>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />} 
                disabled={fields.length >= 2}
              >
                เพิ่มการติดตาม
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default Step5Assessment;
