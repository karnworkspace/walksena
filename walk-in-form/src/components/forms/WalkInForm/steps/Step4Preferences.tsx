
import React from 'react';
import { Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

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
  return (
    <div>
      <Form.Item label="ประเภทห้องที่สนใจ" name="roomType">
        <Select placeholder="เลือกประเภทห้อง">
          {roomTypes.map(roomType => (
            <Option key={roomType} value={roomType}>
              {roomType}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="งบประมาณ" name="budget">
        <Select placeholder="เลือกช่วงงบประมาณ">
          {budgetRanges.map(budget => (
            <Option key={budget} value={budget}>
              {budget}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="ระยะเวลาในการตัดสินใจ" name="decisionTimeframe">
        <Select placeholder="เลือกระยะเวลา">
          {decisionTimeframes.map(timeframe => (
            <Option key={timeframe} value={timeframe}>
              {timeframe}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="วัตถุประสงค์ในการซื้อ" name="purchasePurpose">
        <Select placeholder="เลือกวัตถุประสงค์">
          {purchasePurposes.map(purpose => (
            <Option key={purpose} value={purpose}>
              {purpose}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="เส้นทางหลักในการเดินทางมายังโครงการ" name="mainRoute">
        <Select placeholder="เลือกเส้นทางหลัก">
          {mainRoutes.map(route => (
            <Option key={route} value={route}>
              {route}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="ปัจจัยที่มีผลต่อการตัดสินใจ" name="decisionFactors">
        <Select placeholder="เลือกปัจจัยในการตัดสินใจ">
          {decisionFactors.map(factor => (
            <Option key={factor} value={factor}>
              {factor}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="สิ่งที่สนใจเป็นพิเศษ" name="interests">
        <Select mode="multiple" placeholder="เลือกสิ่งที่สนใจ (เลือกได้หลายรายการ)">
          {interests.map(interest => (
            <Option key={interest} value={interest}>
              {interest}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="ห้างสรรพสินค้าที่ไปบ่อย" name="shoppingMalls">
        <Select mode="multiple" placeholder="เลือกห้างสรรพสินค้า (เลือกได้หลายรายการ)">
          {shoppingMalls.map(mall => (
            <Option key={mall} value={mall}>
              {mall}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="โปรโมชั่นที่สนใจ" name="promotionInterest">
        <Select mode="multiple" placeholder="เลือกโปรโมชั่นที่สนใจ (เลือกได้หลายรายการ)">
          {promotionInterests.map(interest => (
            <Option key={interest} value={interest}>
              {interest}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default Step4Preferences;
