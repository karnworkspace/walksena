
import React from 'react';
import { Form, Radio, Select, Input, DatePicker, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

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
        <Radio.Group>
          <Radio value="A (Potential)">
            A (Potential)
            <div style={{ fontWeight: 'normal', color: '#888', marginLeft: '24px' }}>มีศักยภาพสูง พร้อมตัดสินใจ</div>
          </Radio>
          <Radio value="B">
            B (Interested)
            <div style={{ fontWeight: 'normal', color: '#888', marginLeft: '24px' }}>สนใจ แต่ยังไม่พร้อมตัดสินใจ</div>
          </Radio>
          <Radio value="C">
            C (Casual)
            <div style={{ fontWeight: 'normal', color: '#888', marginLeft: '24px' }}>ดูข้อมูลเบื้องต้น</div>
          </Radio>
          <Radio value="F">
            F (Dead)
            <div style={{ fontWeight: 'normal', color: '#888', marginLeft: '24px' }}>ไม่สนใจ หรือไม่มีศักยภาพ</div>
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="สถานะล่าสุด" name="latestStatus">
        <Select placeholder="เลือกสถานะ">
          {latestStatusOptions.map(option => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
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
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'date']}
                  rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
                >
                  <DatePicker placeholder="วันที่ดำเนินการติดตาม" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'detail']}
                  rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
                >
                  <Input placeholder="รายละเอียดการติดตาม" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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
