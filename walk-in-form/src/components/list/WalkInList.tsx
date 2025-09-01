import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Card, Tag, Typography, Row, Col, Button, Modal, Descriptions } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE } from '../../config';

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
  onCountChange?: (total: number, showing?: number) => void;
}

const WalkInList: React.FC<WalkInListProps> = ({ onEdit, onView, onCountChange }) => {
  const [data, setData] = useState<WalkInData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Infinite scroll controls
  const [visibleCount, setVisibleCount] = useState<number>(30);
  const LOAD_STEP = 20;
  const [aiVisible, setAiVisible] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ ai1?: string; ai2?: string; ai3?: string; ai4?: string }>({});

  // Helper: robustly pick AI1-AI4 from a record (tolerate spaces/case)
  const pickAI = (obj: any, target: string) => {
    if (!obj) return undefined;
    const wanted = target.toUpperCase();
    for (const key of Object.keys(obj)) {
      const norm = String(key).replace(/\s+/g, '').toUpperCase();
      if (norm === wanted) return (obj as any)[key];
    }
    return undefined;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/walkin/entries`);
        const raw: WalkInData[] = response.data.data || [];

        const getNo = (r: WalkInData) => {
          const n = parseInt(
            String(
              r['No.'] || r['No'] || (r as any)['NO'] || (r as any)['no'] || (r as any)['Running Number'] || (r as any)['RowId'] || 0
            ),
            10
          );
          return isNaN(n) ? 0 : n;
        };

        // Sort latest first by running number (desc)
        const sorted = [...raw].sort((a, b) => getNo(b) - getNo(a));
        setData(sorted);
        if (onCountChange) onCountChange(sorted.length, Math.min(visibleCount, sorted.length));
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Set up window-based infinite scroll
  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom) {
        setVisibleCount((prev) => Math.min(prev + LOAD_STEP, data.length));
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [data.length]);

  // Notify parent when visible count or data changes
  useEffect(() => {
    if (onCountChange) onCountChange(data.length, Math.min(visibleCount, data.length));
  }, [data.length, visibleCount, onCountChange]);

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
  const visibleData = data.slice(0, Math.min(visibleCount, data.length));

  const MobileCardView = () => (
    <div>
      {visibleData.map((record, index) => (
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
        title: 'AI',
        key: 'ai',
        width: '70px',
        render: (_: any, record: WalkInData) => (
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              const ai1 = pickAI(record, 'AI1');
              const ai2 = pickAI(record, 'AI2');
              const ai3 = pickAI(record, 'AI3');
              const ai4 = pickAI(record, 'AI4');
              setAiSummary({ ai1, ai2, ai3, ai4 });
              setAiVisible(true);
            }}
          >
            AI
          </Button>
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
        dataSource={visibleData}
        columns={columns}
        rowKey={record => record['No.'] || (record as any)['No'] || Math.random().toString()}
        size="middle"
        pagination={false}
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
        title: 'AI',
        key: 'ai',
        width: '60px',
        render: (_: any, record: WalkInData) => (
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              const ai1 = pickAI(record, 'AI1');
              const ai2 = pickAI(record, 'AI2');
              const ai3 = pickAI(record, 'AI3');
              const ai4 = pickAI(record, 'AI4');
              setAiSummary({ ai1, ai2, ai3, ai4 });
              setAiVisible(true);
            }}
          >
            AI
          </Button>
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
        dataSource={visibleData}
        columns={columns}
        rowKey={record => record['No.'] || (record as any)['No'] || Math.random().toString()}
        size="small"
        pagination={false}
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
            {window.innerWidth < 576 ? '📱 Mobile View' : 
             window.innerWidth < 992 ? '💻 Tablet View' : 
             '🖥️ Desktop View'}
          </div>
        </div>
      }
      className="form-card"
    >
      {/* Count indicator for infinite scroll */}
      <div style={{ textAlign: 'right', color: '#888', fontSize: 12, marginBottom: 8 }}>
        Showing {Math.min(visibleCount, data.length)} of {data.length} items
      </div>

      {getResponsiveView()}

      {/* Bottom indicator when more can load */}
      {visibleCount < data.length && (
        <div style={{ textAlign: 'center', padding: '12px', color: '#888' }}>
          Loading more on scroll...
        </div>
      )}

      <Modal
        title="ผลการสรุปจาก AI"
        open={aiVisible}
        onCancel={() => setAiVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setAiVisible(false)}>ปิด</Button>
        ]}
      >
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="สถานะ">{aiSummary.ai1 || '—'}</Descriptions.Item>
          <Descriptions.Item label="วัตถุประสงค์">{aiSummary.ai2 || '—'}</Descriptions.Item>
          <Descriptions.Item label="สาเหตุ">{aiSummary.ai3 || '—'}</Descriptions.Item>
          <Descriptions.Item label="รายละเอียด">
            <div style={{ whiteSpace: 'pre-wrap' }}>{aiSummary.ai4 || '—'}</div>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </Card>
  );
};

export default WalkInList;
