import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Card, Tag, Typography, Row, Col, Button, Modal, Descriptions } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import senaLogo from '../../assets/sena logo.png';
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
  query?: string;
}

const WalkInList: React.FC<WalkInListProps> = ({ onEdit, onView, onCountChange, query }) => {
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
        setVisibleCount((prev) => prev + LOAD_STEP);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [data.length]);

  // Filter by name or phone according to query
  const normalizePhone = (s: string) => s.replace(/[^0-9]/g, '');
  const filtered = React.useMemo(() => {
    if (!query || query.trim() === '') return data;
    const q = query.trim().toLowerCase();
    const qDigits = normalizePhone(q);
    return data.filter((r) => {
      const name = String(r['ชื่อ นามสกุล'] || '').toLowerCase();
      const phone = normalizePhone(String(r['หมายเลขโทรศัพท์'] || ''));
      return (name.includes(q)) || (qDigits && phone.includes(qDigits));
    });
  }, [data, query]);

  // Reset visible count when query changes
  useEffect(() => { setVisibleCount(30); }, [query]);

  // Notify parent when visible count or filter changes
  useEffect(() => {
    if (onCountChange) onCountChange(filtered.length, Math.min(visibleCount, filtered.length));
  }, [filtered.length, visibleCount, onCountChange]);

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

  // Mobile Card View data source
  const visibleData = filtered.slice(0, Math.min(visibleCount, filtered.length));

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
          <Text strong style={{ color: '#1890ff', fontSize: 13 }}>#{no}</Text>
        ),
      },
      {
        title: 'Customer Info',
        key: 'customerInfo',
        render: (_: any, record: WalkInData) => (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2, lineHeight: 1.2 }}>
              <UserOutlined style={{ marginRight: 6, color: '#1890ff' }} />
              {record['ชื่อ นามสกุล'] || 'N/A'}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.2 }}>
              <PhoneOutlined style={{ marginRight: 6 }} />
              {record['หมายเลขโทรศัพท์'] || 'N/A'}
            </div>
            {record['Email'] && (
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.2 }}>
                <MailOutlined style={{ marginRight: 6 }} />
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
          <Text style={{ fontSize: 12 }}>{date || 'N/A'}</Text>
        ),
      },
      {
        title: 'Room Type',
        dataIndex: 'รูปแบบห้องที่ต้องการ ',
        key: 'roomType',
        render: (roomType: string) => (
          <Text style={{ fontSize: 12 }}>{roomType || 'N/A'}</Text>
        ),
      },
      {
        title: 'Status',
        key: 'statusInfo', 
        render: (_: any, record: WalkInData) => (
          <div>
            <div style={{ marginBottom: 2 }}>
              <Tag color={getGradeColor(record['Grade'] || '')}>
                {record['Grade'] || 'N/A'}
              </Tag>
            </div>
            <div>
              <Tag 
                color={getStatusColor(record['Status ล่าสุด ( เหตุผลที่ยังไม่ติดสินใจ )'] || '')}
                style={{ fontSize: 10 }}
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
        width: '180px',
        render: (_: any, record: WalkInData) => (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              aria-label="AI"
              shape="round"
              size="large"
              style={{
                background: '#13c2c2',
                borderColor: '#13c2c2',
                color: '#ffffff',
                fontWeight: 700,
                letterSpacing: 0.5,
                height: 44,
                width: 88,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
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
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="large"
              style={{ height: 44, padding: '0 18px', borderRadius: 24 }}
              onClick={() => onEdit?.(record)}
            >
              Edit
            </Button>
          </div>
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
        className="responsive-table compact-table"
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
        width: '160px',
        render: (_: any, record: WalkInData) => (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button
              aria-label="AI"
              shape="round"
              size="middle"
              style={{ background: '#13c2c2', borderColor: '#13c2c2', color: '#fff', fontWeight: 700, letterSpacing: 0.5, height: 40, width: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="middle"
              style={{ height: 40, padding: '0 16px', borderRadius: 22 }}
              onClick={() => onEdit?.(record)}
            >
              Edit
            </Button>
          </div>
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
        className="compact-table"
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
        Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} items
      </div>

      {getResponsiveView()}

      {/* Bottom indicator when more can load */}
      {visibleCount < filtered.length && (
        <div style={{ textAlign: 'center', padding: '12px', color: '#888' }}>
          Loading more on scroll...
        </div>
      )}

      <Modal
        title="ผลการสรุปจาก AI"
        open={aiVisible}
        onCancel={() => setAiVisible(false)}
        centered={false}
        width="90vw"
        style={{ top: 140 }}
        zIndex={5000}
        wrapClassName="ai-modal"
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto', padding: 16 }}
        maskStyle={{ backdropFilter: 'blur(2px)' }}
        footer={[
          <Button key="close" type="primary" onClick={() => setAiVisible(false)}>ปิด</Button>
        ]}
      >
        <Descriptions column={1} size="middle" bordered>
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
