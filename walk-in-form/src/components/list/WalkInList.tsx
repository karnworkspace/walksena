import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Card, Tag, Typography, Row, Col, Button, Space } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
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
              <Space size="small" style={{ width: '100%', justifyContent: 'center' }}>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={() => onEdit?.(record)}
                >
                  Edit
                </Button>
                <Button 
                  icon={<EyeOutlined />} 
                  size="small"
                  onClick={() => onView?.(record)}
                >
                  View
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );

  // Desktop Table View
  const DesktopTableView = () => {
    const columns = [
      {
        title: 'No.',
        dataIndex: 'No.',
        key: 'no',
        width: 60,
        fixed: 'left' as const,
      },
      {
        title: 'Name',
        dataIndex: 'ชื่อ นามสกุล',
        key: 'name',
        width: 200,
        fixed: 'left' as const,
      },
      {
        title: 'Phone',
        dataIndex: 'หมายเลขโทรศัพท์',
        key: 'phone',
        width: 150,
      },
      {
        title: 'Grade',
        dataIndex: 'Grade',
        key: 'grade',
        width: 100,
        render: (grade: string) => (
          <Tag color={getGradeColor(grade)}>{grade}</Tag>
        ),
      },
      {
        title: 'Sales',
        dataIndex: 'Sales Queue',
        key: 'sales',
        width: 100,
      },
      {
        title: 'Visit Date',
        dataIndex: 'DATE ( เข้าชมโครงการ )',
        key: 'visitDate',
        width: 120,
      },
      {
        title: 'Room Type',
        dataIndex: 'รูปแบบห้องที่ต้องการ ',
        key: 'roomType',
        width: 150,
      },
      {
        title: 'Status',
        dataIndex: 'Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )',
        key: 'status',
        width: 200,
        render: (status: string) => (
          <Tag color={getStatusColor(status)}>{status || 'N/A'}</Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        fixed: 'right' as const,
        render: (_: any, record: WalkInData) => (
          <Space size="small">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => onEdit?.(record)}
            >
              Edit
            </Button>
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => onView?.(record)}
            >
              View
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        dataSource={data}
        columns={columns}
        rowKey={record => record['No.'] || Math.random().toString()}
        scroll={{ x: 1320, y: 600 }}
        size="small"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    );
  };

  // Check if mobile view
  const isMobile = window.innerWidth < 768;

  return (
    <Card 
      title={`Walk-in Records (${data.length} entries)`}
      className="form-card"
    >
      {isMobile ? <MobileCardView /> : <DesktopTableView />}
    </Card>
  );
};

export default WalkInList;
