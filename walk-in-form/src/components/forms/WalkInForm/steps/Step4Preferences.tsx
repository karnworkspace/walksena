
import React from 'react';
import { Form, Card, Typography, Input } from 'antd';

const { Text } = Typography;

// ประเภทห้องที่สนใจ
const roomTypes = [
  '1Bedroom',
  '1Bedroom Plus',
  '2Bedroom'
];

// งบประมาณ
const budgetRanges = [
  'ต่ำกว่า 5 ล้าน',
  '5-6 ล้าน',
  '7-8 ล้าน',
  '9-10 ล้าน',
  '10 ล้านขึ้นไป'
];

// ระยะเวลาในการตัดสินใจ
const decisionTimeframes = [
  'ต่ำกว่า 1 เดือน',
  '1-3 เดือน',
  '4-6 เดือน',
  '7-9 เดือน',
  '10-12 เดือน',
  'มากกว่า 1 ปี'
];

// วัตถุประสงค์ในการซื้อ
const purchasePurposes = [
  'เพื่ออยู่อาศัย',
  'เก็บไว้เป็นทรัพย์สิน',
  'ลงทุน',
  'ลงทุนระยะยาว(ปล่อยเช่า)',
  'ไม่กรอกข้อมูล'
];

// เส้นทางหลักในการเดินทางมายังโครงการ
const mainRoutes = [
  'ถ.เอกมัย',
  'เพชรบุรี',
  'ถ.รัชดาภิเษก/รามคำแหง',
  'ถ.ศรีนครินทร์',
  'ถ.ลาดกระบัง',
  'ถ.ศรีลา (วงแหวนตะวันออก)'
];

// ปัจจัยที่มีผลต่อการตัดสินใจ
const decisionFactors = [
  'ราคา และ รูปแบบห้อง',
  'ราคา และ ความคุ้มค่า',
  'ราคา และ รูปแบบโครงการ',
  'รูปแบบแปลนห้อง',
  'รูปแบบห้อง',
  'ราคา',
  'ทำเล',
  'Pet Friendly',
  'ส่วนลด'
];

// สิ่งที่สนใจเป็นพิเศษ
const interests = [
  'อสังหาริมทรัพย์',
  'การลงทุน',
  'การดูแลสุขภาพ',
  'การเงินและการลงทุน',
  'แฟชั่น',
  'การท่องเที่ยว',
  'ธุรกิจการค้า',
  'หนังสือ',
  'อาหารและเครื่องดื่ม',
  'อื่นๆ'
];

// ห้างสรรพสินค้าที่ไปบ่อย
const shoppingMalls = [
  'Emporium',
  'EmSphere',
  'Terminal21',
  'EmQuartier',
  'Embassy',
  'CentralWorld',
  'Mega Bangna',
  'J-Avenue',
  'Marche Thonglor',
  'Gateway Ekkamai',
  'Siam Paragon'
];

const promotionInterests = [
  'ส่วนลด',
  'ส่วนลดเงินสด',
  'เฟอร์นิเจอร์'
];

const Step4Preferences: React.FC = () => {
  // Custom Clickable List Component
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

  // Multi-Select Clickable List Component
  const MultiSelectClickableList: React.FC<{
    title: string;
    options: string[];
    value?: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
  }> = ({ title, options, value = [], onChange, placeholder }) => (
    <Card 
      size="small" 
      style={{ 
        borderRadius: '8px',
        border: value.length > 0 ? '2px solid #1890ff' : '1px solid #d9d9d9'
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <Text strong style={{ color: '#1890ff' }}>
          {title}
        </Text>
        {placeholder && value.length === 0 && (
          <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
            ({placeholder})
          </Text>
        )}
        {value.length > 0 && (
          <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
            ({value.length} selected)
          </Text>
        )}
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {options?.map(option => {
          const isSelected = value.includes(option);
          return (
            <div
              key={option}
              onClick={() => {
                const newValue = isSelected 
                  ? value.filter(v => v !== option)
                  : [...value, option];
                onChange(newValue);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: isSelected ? '2px solid #1890ff' : '1px solid #e0e0e0',
                backgroundColor: isSelected ? '#f0f8ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#1890ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }
              }}
            >
              {option}
            </div>
          );
        })}
      </div>
    </Card>
  );

  return (
    <div>
      <Form.Item label="ประเภทห้องที่สนใจ" name="roomType">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกประเภทห้องที่สนใจ"
              options={roomTypes}
              value={getFieldValue('roomType')}
              onChange={(value) => setFieldsValue({ roomType: value })}
              placeholder="เลือกประเภทห้องที่ต้องการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="งบประมาณ" name="budget">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกช่วงงบประมาณ"
              options={budgetRanges}
              value={getFieldValue('budget')}
              onChange={(value) => setFieldsValue({ budget: value })}
              placeholder="เลือกงบประมาณที่เหมาะสม"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="ระยะเวลาในการตัดสินใจ" name="decisionTimeframe">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกระยะเวลาในการตัดสินใจ"
              options={decisionTimeframes}
              value={getFieldValue('decisionTimeframe')}
              onChange={(value) => setFieldsValue({ decisionTimeframe: value })}
              placeholder="เลือกระยะเวลาที่คาดว่าจะตัดสินใจ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="วัตถุประสงค์ในการซื้อ" name="purchasePurpose">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกวัตถุประสงค์ในการซื้อ"
              options={purchasePurposes}
              value={getFieldValue('purchasePurpose')}
              onChange={(value) => setFieldsValue({ purchasePurpose: value })}
              placeholder="เลือกเหตุผลหลักในการซื้อ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="เส้นทางหลักในการเดินทางมายังโครงการ" name="mainRoute">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกเส้นทางหลักในการเดินทาง"
              options={mainRoutes}
              value={getFieldValue('mainRoute')}
              onChange={(value) => setFieldsValue({ mainRoute: value })}
              placeholder="เลือกเส้นทางที่ใช้บ่อยที่สุด"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="ปัจจัยที่มีผลต่อการตัดสินใจ" name="decisionFactors">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกปัจจัยที่มีผลต่อการตัดสินใจ"
              options={decisionFactors}
              value={getFieldValue('decisionFactors')}
              onChange={(value) => setFieldsValue({ decisionFactors: value })}
              placeholder="เลือกปัจจัยสำคัญในการตัดสินใจ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="สิ่งที่สนใจเป็นพิเศษ" name="interests">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <MultiSelectClickableList
              title="เลือกสิ่งที่สนใจเป็นพิเศษ"
              options={interests}
              value={getFieldValue('interests')}
              onChange={(value) => setFieldsValue({ interests: value })}
              placeholder="เลือกได้หลายรายการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="ห้างสรรพสินค้าที่ไปบ่อย" name="shoppingMalls">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <MultiSelectClickableList
              title="เลือกห้างสรรพสินค้าที่ไปบ่อย"
              options={shoppingMalls}
              value={getFieldValue('shoppingMalls')}
              onChange={(value) => setFieldsValue({ shoppingMalls: value })}
              placeholder="เลือกได้หลายรายการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="โปรโมชั่นที่สนใจ" name="promotionInterest">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <MultiSelectClickableList
              title="เลือกโปรโมชั่นที่สนใจ"
              options={promotionInterests}
              value={getFieldValue('promotionInterest')}
              onChange={(value) => setFieldsValue({ promotionInterest: value })}
              placeholder="เลือกได้หลายรายการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      {/* โครงการเปรียบเทียบ (Column AN) */}
      <Form.Item label="โครงการเปรียบเทียบ" name="comparisonProjects">
        <Input placeholder="พิมพ์ชื่อโครงการเปรียบเทียบ" />
      </Form.Item>
    </div>
  );
};

export default Step4Preferences;
