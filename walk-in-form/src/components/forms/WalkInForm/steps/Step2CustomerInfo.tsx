
import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';

const { Text } = Typography;

const Step2CustomerInfo: React.FC = () => {
  return (
    <div>
      <Form.Item
        label="ชื่อ - นามสกุล"
        name="fullName"
        rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
      >
        <Input placeholder="กรอกชื่อ-นามสกุล" />
      </Form.Item>

      <Form.Item
        label="หมายเลขโทรศัพท์"
        name="phoneNumber"
        rules={[{ required: true, message: 'กรุณากรอกหมายเลขโทรศัพท์' }]}
      >
        <Input
          placeholder="099-999-9999"
          addonAfter={<Button type="link" size="small">Check</Button>}
          style={{ fontSize: '16px' }}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', message: 'รูปแบบ Email ไม่ถูกต้อง' }]}
      >
        <Input placeholder="กรอก Email" />
      </Form.Item>

      <Form.Item
        label="Line ID"
        name="lineId"
      >
        <Input placeholder="กรอก Line ID" />
      </Form.Item>

      {/* อายุ (ช่วงอายุแบบคลิกได้) */}
      <Form.Item label="อายุ" name="age">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => {
            const value = getFieldValue('age');
            const options = [
              'น้อยกว่า 21 ปี',
              '21 - 30 ปี',
              '31 - 40 ปี',
              '41 - 50 ปี',
              '51 - 60 ปี',
              '60 ปี ขึ้นไป',
              'ไม่มีข้อมูลลูกค้า',
            ];

            return (
              <Card size="small" style={{ borderRadius: 8, border: value ? '2px solid #1890ff' : '1px solid #d9d9d9' }}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong style={{ color: '#1890ff' }}>เลือกช่วงอายุ</Text>
                  {!value && (
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>(เลือกได้ 1 รายการ)</Text>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
                  {options.map((opt) => {
                    const selected = value === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => setFieldsValue({ age: opt })}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: selected ? '2px solid #1890ff' : '1px solid #e0e0e0',
                          backgroundColor: selected ? '#f0f8ff' : '#fff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                            e.currentTarget.style.borderColor = '#1890ff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                          }
                        }}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          }}
        </Form.Item>
      </Form.Item>
    </div>
  );
};

export default Step2CustomerInfo;
