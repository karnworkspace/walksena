
import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';

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

      <Form.Item
        label="อายุ"
        name="age"
      >
        <InputNumber min={18} max={80} style={{ width: '100%' }} placeholder="กรอกอายุ" />
      </Form.Item>
    </div>
  );
};

export default Step2CustomerInfo;
