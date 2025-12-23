import React, { useState } from 'react';
// import styles from './Login.module.scss'; // Removing custom styles
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import showNotification from '../Notification/showNotification';
import type { RegisterPayload } from '../../types/authTypes';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, HomeOutlined, NumberOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RegisterUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const convertFormDataToRegisterPayload = (formData: any): RegisterPayload => {
    return {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      mobileNum: formData.phone,
      pincode: formData.pinCode,
      userName: formData.userName,
      city: formData.city,
      state: formData.state,
      userTypeId: 3,
    };
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = convertFormDataToRegisterPayload(values);
      await registerUser(payload);
      showNotification.success('User added successfully');
      navigate('/login');
    } catch (err: any) {
      showNotification.error(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff7e6', padding: '20px' }}>
      <Card
        style={{ width: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderColor: '#ffa940' }}
        title={<Title level={3} style={{ textAlign: 'center', margin: 0, color: '#d46b08' }}>Register</Title>}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Text type="secondary">Create an account to start ordering delicious pizzas!</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name!', whitespace: true }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="userName"
                label="User Name"
                rules={[{ required: true, message: 'Please input a username!', whitespace: true }]}
              >
                <Input prefix={<UserOutlined />} placeholder="User Name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please input your phone number!' },
                  { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits!' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'The input is not valid E-mail!' },
                  { required: true, message: 'Please input your E-mail!' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/, message: 'Password must be at least 8 characters, include digit, lowercase, uppercase, and special char.' }
                ]}
                hasFeedback
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please input your address!', whitespace: true }]}
              >
                <Input.TextArea rows={2} placeholder="Address" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="City" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please input your state!' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="State" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="pinCode"
                label="Pin Code"
                rules={[
                  { required: true, message: 'Please input your pin code!' },
                  { pattern: /^\d{6}$/, message: 'Pin Code must be 6 digits!' }
                ]}
              >
                <Input prefix={<NumberOutlined />} placeholder="Pin Code" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} size="large">
              Register
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <a onClick={() => navigate('/login')}>Already have an account? Login</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterUser;
