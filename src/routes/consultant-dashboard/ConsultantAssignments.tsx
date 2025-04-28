import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Table, 
  Space, 
  Tag, 
  Button, 
  Tooltip, 
  Modal, 
  Form, 
  Input, 
  message,
  Rate,
  DatePicker
} from 'antd';
import {
  CalendarOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Timestamp } from 'firebase/firestore';
import { useGetIdentity } from '@refinedev/core';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Assignment {
  id: string;
  participantId: string;
  participantName: string;
  consultantId: string;
  consultantName: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  lastSessionDate?: Timestamp;
  nextSessionDate?: Timestamp;
  notes?: string;
  feedback?: {
    rating: number;
    comments: string;
  };
}

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export const ConsultantAssignments: React.FC = () => {
  const { data: user } = useGetIdentity<UserIdentity>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [sessionForm] = Form.useForm();
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [notesForm] = Form.useForm();

  // Load data
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        // Mock data for now until we implement actual Firebase collections
        // In a real implementation, these would be fetched from Firestore filtered by the consultant ID
        const mockAssignments: Assignment[] = [
          { 
            id: 'a1', 
            participantId: 'p1', 
            participantName: 'John Smith', 
            consultantId: 'c1', 
            consultantName: user?.name || 'Current Consultant', 
            status: 'active', 
            createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            lastSessionDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
            nextSessionDate: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))
          },
          { 
            id: 'a2', 
            participantId: 'p2', 
            participantName: 'Sara Johnson', 
            consultantId: 'c1', 
            consultantName: user?.name || 'Current Consultant', 
            status: 'active', 
            createdAt: Timestamp.fromDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
            lastSessionDate: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
          }
        ];
        
        setAssignments(mockAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        message.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAssignments();
    }
  }, [user]);

  // Handle recording a session
  const showSessionModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    sessionForm.resetFields();
    setSessionModalVisible(true);
  };

  const handleRecordSession = async (values: any) => {
    if (!selectedAssignment) return;

    try {
      // Update assignment with new session info
      const updatedAssignments = assignments.map(a => {
        if (a.id === selectedAssignment.id) {
          return {
            ...a,
            lastSessionDate: Timestamp.now(),
            nextSessionDate: values.nextSessionDate ? Timestamp.fromDate(values.nextSessionDate.toDate()) : undefined,
          };
        }
        return a;
      });

      setAssignments(updatedAssignments);
      setSessionModalVisible(false);
      message.success("Session recorded successfully");
    } catch (error) {
      console.error("Error recording session:", error);
      message.error("Failed to record session");
    }
  };

  // Handle notes
  const showNotesModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    notesForm.setFieldsValue({
      notes: assignment.notes || ''
    });
    setNotesModalVisible(true);
  };

  const handleSaveNotes = async (values: any) => {
    if (!selectedAssignment) return;

    try {
      // Update assignment with new notes
      const updatedAssignments = assignments.map(a => {
        if (a.id === selectedAssignment.id) {
          return {
            ...a,
            notes: values.notes
          };
        }
        return a;
      });

      setAssignments(updatedAssignments);
      setNotesModalVisible(false);
      message.success("Notes saved successfully");
    } catch (error) {
      console.error("Error saving notes:", error);
      message.error("Failed to save notes");
    }
  };

  // Handle completing an assignment
  const handleCompleteAssignment = (assignmentId: string) => {
    Modal.confirm({
      title: 'Mark Assignment as Completed',
      content: 'Are you sure you want to mark this assignment as completed?',
      onOk: async () => {
        try {
          // Update assignment status
          const updatedAssignments = assignments.map(a => {
            if (a.id === assignmentId) {
              return {
                ...a,
                status: 'completed' as 'active' | 'completed' | 'cancelled'
              };
            }
            return a;
          });

          setAssignments(updatedAssignments);
          message.success("Assignment marked as completed");
        } catch (error) {
          console.error("Error updating assignment:", error);
          message.error("Failed to update assignment");
        }
      }
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Participant',
      dataIndex: 'participantName',
      key: 'participantName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'completed' ? 'blue' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Session',
      key: 'lastSessionDate',
      render: (record: Assignment) => record.lastSessionDate 
        ? new Date(record.lastSessionDate.toMillis()).toLocaleDateString() 
        : 'No sessions yet',
    },
    {
      title: 'Next Session',
      key: 'nextSessionDate',
      render: (record: Assignment) => record.nextSessionDate 
        ? new Date(record.nextSessionDate.toMillis()).toLocaleDateString() 
        : 'Not scheduled',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Assignment) => (
        <Space size="small">
          <Tooltip title="Record Session">
            <Button 
              type="primary" 
              size="small" 
              icon={<CalendarOutlined />}
              onClick={() => showSessionModal(record)}
              disabled={record.status !== 'active'}
            >
              Record Session
            </Button>
          </Tooltip>
          <Tooltip title="Notes">
            <Button 
              size="small" 
              icon={<CommentOutlined />}
              onClick={() => showNotesModal(record)}
              disabled={record.status !== 'active'}
            >
              Notes
            </Button>
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Complete">
              <Button 
                type="primary" 
                size="small"
                icon={<CheckCircleOutlined />}
                style={{ backgroundColor: '#52c41a' }}
                onClick={() => handleCompleteAssignment(record.id)}
              >
                Complete
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={assignments} 
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: record => (
            <div style={{ padding: '20px' }}>
              <Title level={5}>Assignment Details</Title>
              <Paragraph>
                <Text strong>Created: </Text> 
                {new Date(record.createdAt.toMillis()).toLocaleDateString()}
              </Paragraph>
              {record.notes && (
                <div>
                  <Text strong>Notes: </Text>
                  <Paragraph>{record.notes}</Paragraph>
                </div>
              )}
            </div>
          ),
        }}
      />
      
      {/* Session Recording Modal */}
      <Modal
        title="Record Mentoring Session"
        open={sessionModalVisible}
        onCancel={() => setSessionModalVisible(false)}
        footer={null}
      >
        <Form 
          form={sessionForm}
          layout="vertical"
          onFinish={handleRecordSession}
        >
          <Form.Item
            name="nextSessionDate"
            label="Schedule Next Session"
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="sessionNotes"
            label="Session Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Record Session
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Notes Modal */}
      <Modal
        title="Participant Notes"
        open={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        footer={null}
      >
        <Form 
          form={notesForm}
          layout="vertical"
          onFinish={handleSaveNotes}
        >
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={6} placeholder="Enter your notes about this participant..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Notes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 