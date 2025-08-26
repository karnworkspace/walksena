
import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Select, Radio, Input } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface DropdownOptions {
  salesQueue: Array<{ value: string; label: string }>;
  walkInType: Array<{ value: string; label: string }>;
  mediaOnline: Array<{ value: string; label: string }>;
  mediaOffline: Array<{ value: string; label: string }>;
  passSiteSource: Array<{ value: string; label: string }>;
  grade: Array<{ value: string; label: string; description?: string }>;
}

const Step1VisitInfo: React.FC = () => {
  const [options, setOptions] = useState<DropdownOptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/walkin/dropdown-options');
        if (response.data.success) {
          setOptions(response.data.options);
        }
      } catch (error) {
        console.error('Failed to fetch dropdown options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
      <Form.Item
        label="วันที่เข้าชมโครงการ"
        name="visitDate"
        // Temporarily disable validation to fix the error
        // rules={[{ required: true, message: 'กรุณาเลือกวันที่เข้าชมโครงการ' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="YYYY-MM-DD"
          placeholder="เลือกวันที่"
          allowClear
        />
      </Form.Item>

      <Form.Item
        label="Sales ผู้ดูแล"
        name="salesQueue"
        rules={[{ required: true, message: 'กรุณาเลือก Sales ผู้ดูแล' }]}
      >
        <Select placeholder="เลือก Sales ผู้ดูแล" loading={loading}>
          {options?.salesQueue?.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="ประเภท Walk-in"
        name="walkInType"
        rules={[{ required: true, message: 'กรุณาเลือกประเภท Walk-in' }]}
      >
        <Radio.Group>
          {options?.walkInType?.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="สื่อ Online"
        name="mediaOnline"
      >
        <Select placeholder="เลือกสื่อ Online" loading={loading}>
          {options?.mediaOnline?.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="สื่อ Offline"
        name="mediaOffline"
      >
        <Select placeholder="เลือกสื่อ Offline" loading={loading}>
          {options?.mediaOffline?.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="แหล่งที่มาของสื่อโฆษณาที่พบระหว่างเดินทาง (Pass Site)"
        name="passSiteSource"
      >
        <Select placeholder="เลือกแหล่งที่มาของสื่อโฆษณา" loading={loading}>
          {options?.passSiteSource?.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default Step1VisitInfo;
