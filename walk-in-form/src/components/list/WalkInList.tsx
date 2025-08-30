import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Card, Tag, Typography, Row, Col, Button } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

interface WalkInData {
  'No.'?: string;
  'ชื่อ นามสกุล'?: string;
  'หมายเลขโทรศัพท์'?: string;
  'Email'?: string;
  'Sales Queue'?: string;
  'Walk-in Type'?: string;
  'Grade'?: string;
  'DATE ( เข้าชมโครงการ )'?: string;
  'รูปแบบห้องที่ต้องการ '?: string;
  'งบประมาณในการซื้อ'?: string;
  'Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'?: string;
  [key: string]: any;
}

interface WalkInListProps {
  onEdit?: (record: WalkInData) => void;
  onView?: (record: WalkInData) => void;
}

const WalkInList: React.FC<WalkInListProps> = ({ onEdit, onView }) => {
  const [data, setData] = useState<WalkInData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/walkin/entries');
        setData(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading data...</div>
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  const getGradeColor = (grade: string) => {
    if (grade?.includes('A')) return 'green';
    if (grade?.includes('B')) return 'blue';
    if (grade?.includes('C')) return 'orange';
    if (grade?.includes('F')) return 'red';
    return 'default';
  };

  const getStatusColor = (status: string) => {
    if (status?.includes('Win') || status?.includes('Book')) return 'green';
    if (status?.includes('Dead')) return 'red';
    if (status?.includes('ปรึกษา')) return 'blue';
    return 'default';
  };

  // Mobile Card View
  const MobileCardView = () => (
    <div>
      {data.map((record, index) => (
        <Card 
          key={record['No.'] || index} 
          style={{ marginBottom: '16px' }}
          size="small"
        >
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong>#{record['No.']}</Text>
                <Tag color={getGradeColor(record['Grade'] || '')}>{record['Grade']}</Tag>
              </div>
            </Col>
            
            <Col span={24}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text strong>{record['ชื่อ นามสกุล'] || 'N/A'}</Text>
              </div>
            </Col>
            
            <Col span={24}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <PhoneOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text>{record['หมายเลขโทรศัพท์'] || 'N/A'}</Text>
              </div>
            </Col>
            
            {record['Email'] && (
              <Col span={24}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                  <Text>{record['Email']}</Text>
                </div>
              </Col>
            )}
            
            <Col span={12}>
              <Text type="secondary">Sales:</Text>
              <div><Text>{record['Sales Queue'] || 'N/A'}</Text></div>
            </Col>
            
            <Col span={12}>
              <Text type="secondary">Visit Date:</Text>
              <div><Text>{record['DATE ( เข้าชมโครงการ )'] || 'N/A'}</Text></div>
            </Col>
            
            <Col span={24}>
              <Text type="secondary">Room Type:</Text>
              <div><Text>{record['รูปแบบห้องที่ต้องการ '] || 'N/A'}</Text></div>
            </Col>
            
            <Col span={24}>
              <Text type="secondary">Budget:</Text>
              <div><Text>{record['งบประมาณในการซื้อ'] || 'N/A'}</Text></div>
            </Col>
            
            <Col span={24}>
              <Text type="secondary">Status:</Text>
              <div>
                <Tag color={getStatusColor(record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || '')}>
                  {record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || 'N/A'}
                </Tag>
              </div>
            </Col>
            
            <Col span={24} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                size="middle"
                block
                onClick={() => onEdit?.(record)}
              >
                Edit Record
              </Button>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );

  // Desktop Table View - Responsive without horizontal scroll
  const DesktopTableView = () => {
    const columns = [
      {
        title: 'No.',
        dataIndex: 'No.',
        key: 'no',
        width: '60px',
        render: (no: string) => (
          <Text strong style={{ color: '#1890ff' }}>#{no}</Text>
        ),
      },
      {
        title: 'Customer Info',
        key: 'customerInfo',
        render: (_: any, record: WalkInData) => (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              <UserOutlined style={{ marginRight: '6px', color: '#1890ff' }} />
              {record['ชื่อ นามสกุล'] || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <PhoneOutlined style={{ marginRight: '6px' }} />
              {record['หมายเลขโทรศัพท์'] || 'N/A'}
            </div>
            {record['Email'] && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                <MailOutlined style={{ marginRight: '6px' }} />
                {record['Email']}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Visit Date',
        dataIndex: 'DATE ( เข้าชมโครงการ )',
        key: 'visitDate',
        width: '110px',
        render: (date: string) => (
          <Text style={{ fontSize: '13px' }}>{date || 'N/A'}</Text>
        ),
      },
      {
        title: 'Room Type',
        dataIndex: 'รูปแบบห้องที่ต้องการ ',
        key: 'roomType',
        render: (roomType: string) => (
          <Text style={{ fontSize: '13px' }}>{roomType || 'N/A'}</Text>
        ),
      },
      {
        title: 'Status',
        key: 'statusInfo', 
        render: (_: any, record: WalkInData) => (
          <div>
            <div style={{ marginBottom: '4px' }}>
              <Tag color={getGradeColor(record['Grade'] || '')}>
                {record['Grade'] || 'N/A'}
              </Tag>
            </div>
            <div>
              <Tag 
                color={getStatusColor(record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || '')}
                style={{ fontSize: '11px' }}
              >
                {record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || 'N/A'}
              </Tag>
            </div>
          </div>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '100px',
        render: (_: any, record: WalkInData) => (
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="middle"
            onClick={() => onEdit?.(record)}
            block
          >
            Edit
          </Button>
        ),
      },
    ];

    return (
      <Table
        dataSource={data}
        columns={columns}
        rowKey={record => record['No.'] || Math.random().toString()}
        scroll={{ y: 600 }}
        size="middle"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        className="responsive-table"
      />
    );
  };

  // Compact Table View for tablets
  const TabletTableView = () => {
    const columns = [
      {
        title: 'Customer',
        key: 'customer',
        render: (_: any, record: WalkInData) => (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
              #{record['No.']} {record['ชื่อ นามสกุล'] || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              📞 {record['หมายเลขโทรศัพท์'] || 'N/A'}
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              📅 {record['DATE ( เข้าชมโครงการ )'] || 'N/A'}
            </div>
          </div>
        ),
      },
      {
        title: 'Details',
        key: 'details',
        render: (_: any, record: WalkInData) => (
          <div>
            <div style={{ marginBottom: '4px' }}>
              <Tag color={getGradeColor(record['Grade'] || '')}>
                {record['Grade'] || 'N/A'}
              </Tag>
            </div>
            <div style={{ fontSize: '11px', marginBottom: '2px' }}>
              🏠 {record['รูปแบบห้องที่ต้องการ '] || 'N/A'}
            </div>
            <div>
              <Tag 
                color={getStatusColor(record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || '')}
                style={{ fontSize: '10px' }}
              >
                {record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || 'N/A'}
              </Tag>
            </div>
          </div>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '80px',
        render: (_: any, record: WalkInData) => (
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            block
            onClick={() => onEdit?.(record)}
          >
            Edit
          </Button>
        ),
      },
    ];

    return (
      <Table
        dataSource={data}
        columns={columns}
        rowKey={record => record['No.'] || Math.random().toString()}
        scroll={{ y: 500 }}
        size="small"
        pagination={{
          pageSize: 15,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total}`,
        }}
      />
    );
  };

  // Responsive view selection
  const getResponsiveView = () => {
    const width = window.innerWidth;
    if (width < 576) return <MobileCardView />;      // Mobile
    if (width < 992) return <TabletTableView />;     // Tablet  
    return <DesktopTableView />;                     // Desktop
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Walk-in Records ({data.length} entries)</span>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
            {window.innerWidth < 576 ? '📱 Mobile View' : 
             window.innerWidth < 992 ? '💻 Tablet View' : 
             '🖥️ Desktop View'}
          </div>
        </div>
      }
      className="form-card"
    >
      {getResponsiveView()}
    </Card>
  );
};

export default WalkInList;
