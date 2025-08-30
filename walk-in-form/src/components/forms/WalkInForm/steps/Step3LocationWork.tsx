
import React from 'react';
import { Form, Input, Select, InputNumber, Card, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

// 77 จังหวัดของประเทศไทย
const thailandProvinces = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร',
  'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท',
  'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง',
  'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม',
  'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส',
  'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา',
  'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์',
  'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน',
  'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง',
  'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย',
  'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
  'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี',
  'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย',
  'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์',
  'อุทัยธานี', 'อุบลราชธานี'
];

// 50 เขตในกรุงเทพมหานคร
const bangkokDistricts = [
  'เขตพระนคร', 'เขตดุสิต', 'เขตหนองจอก', 'เขตบางรัก', 'เขตบางเขน',
  'เขตบางกะปิ', 'เขตปทุมวัน', 'เขตป้อมปราบศัตรูพ่าย', 'เขตพระโขนง', 'เขตมีนบุรี',
  'เขตลาดกระบัง', 'เขตยานนาวา', 'เขตสัมพันธวงศ์', 'เขตพญาไท', 'เขตธนบุรี',
  'เขตบางกอกใหญ่', 'เขตห้วยขวาง', 'เขตคลองสาน', 'เขตตลิ่งชัน', 'เขตบางกอกน้อย',
  'เขตบางขุนเทียน', 'เขตภาษีเจริญ', 'เขตหนองแขม', 'เขตราษฎร์บูรณะ', 'เขตบางพลัด',
  'เขตดินแดง', 'เขตบึงกุ่ม', 'เขตสาทร', 'เขตบางซื่อ', 'เขตจตุจักร',
  'เขตบางคอแหลม', 'เขตประเวศ', 'เขตคลองเตย', 'เขตสวนหลวง', 'เขตจอมทอง',
  'เขตดอนเมือง', 'เขตราชเทวี', 'เขตลาดพร้าว', 'เขตวัฒนา', 'เขตบางแค',
  'เขตหลักสี่', 'เขตสายไหม', 'เขตคันนายาว', 'เขตสะพานสูง', 'เขตวังทองหลาง',
  'เขตคลองสามวา', 'เขตบางนา', 'เขตทวีวัฒนา', 'เขตทุ่งครุ', 'เขตบางบอน'
];

// อาชีพ
const occupations = [
  'พนักงานบริษัทเอกชน',
  'รับราชการ/วิสาหกิจ',
  'แพทย์/พยาบาล',
  'อาชีพอิสระ',
  'แม่บ้าน/พ่อบ้าน',
  'ธุรกิจส่วนตัว',
  'อื่น/ไม่ให้ข้อมูล'
];

// รายได้ต่อเดือน
const incomeRanges = [
  'น้อยกว่า 50,000 บาท',
  '50,001 - 80,000 บาท',
  '80,001 - 100,000 บาท',
  '100,001 - 120,000 บาท',
  '120,001 - 150,000 บาท',
  '150,001 - 300,000 บาท',
  '300,001 - 500,000 บาท',
  'มากกว่า 500,000 บาท'
];

const Step3LocationWork: React.FC = () => {
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
  return (
    <div>
      <Form.Item label="จังหวัดที่พักอาศัย" name="residenceProvince">
        <Select
          placeholder="เลือก หรือสามารถพิมพ์เพื่อค้นหาจังหวัด"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {thailandProvinces.map(province => (
            <Option key={province} value={province}>
              {province}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="เขตที่พักอาศัย" name="residenceDistrict">
        <Select
          placeholder="เลือก หรือสามารถพิมพ์เพื่อค้นหาเขต"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {bangkokDistricts.map(district => (
            <Option key={district} value={district}>
              {district}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="จังหวัดที่ทำงาน" name="workProvince">
        <Select
          placeholder="เลือก หรือสามารถพิมพ์เพื่อค้นหาจังหวัด"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {thailandProvinces.map(province => (
            <Option key={province} value={province}>
              {province}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="เขตที่ทำงาน" name="workDistrict">
        <Select
          placeholder="เลือก หรือสามารถพิมพ์เพื่อค้นหาเขต"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {bangkokDistricts.map(district => (
            <Option key={district} value={district}>
              {district}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="บริษัท" name="company">
        <Input placeholder="พิมพ์ชื่อบริษัท" />
      </Form.Item>

      <Form.Item label="ตำแหน่ง" name="position">
        <Input placeholder="พิมพ์ตำแหน่งงาน" />
      </Form.Item>

      <Form.Item label="อาชีพ" name="occupation">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกอาชีพ"
              options={occupations}
              value={getFieldValue('occupation')}
              onChange={(value) => setFieldsValue({ occupation: value })}
              placeholder="เลือกได้ 1 รายการ"
            />
          )}
        </Form.Item>
      </Form.Item>

      <Form.Item label="รายได้ต่อเดือน" name="monthlyIncome">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ClickableList
              title="เลือกช่วงรายได้"
              options={incomeRanges}
              value={getFieldValue('monthlyIncome')}
              onChange={(value) => setFieldsValue({ monthlyIncome: value })}
              placeholder="เลือกได้ 1 รายการ"
            />
          )}
        </Form.Item>
      </Form.Item>
    </div>
  );
};

export default Step3LocationWork;
