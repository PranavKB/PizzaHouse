import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import styles from './Login.module.scss'; // Removing custom styles
import showNotification from '../Notification/showNotification';
import { resetPasswordRequest } from '../../services/authService';
import { Form, Input, Button, Card, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await resetPasswordRequest(values.email);
      showNotification.success('Password reset link has been sent to your email');
      navigate('/login');
    } catch (error: any) {
      showNotification.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff7e6' }}>
      <Card
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderColor: '#ffa940' }}
        title={<Title level={3} style={{ textAlign: 'center', margin: 0, color: '#fa8c16' }}>Reset Password</Title>}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Text>Enter your email address and we'll send you a link to reset your password.</Text>
        </div>

        <Form
          name="forgot_password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/login')} icon={<ArrowLeftOutlined />} style={{ color: '#fa8c16' }}>
              Back to Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
