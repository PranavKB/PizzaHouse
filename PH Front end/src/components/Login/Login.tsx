import React, { useState } from 'react';
// import styles from './Login.module.scss'; // Removing custom styles
import { loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import type { LoginPageProps } from '../../types/interfaces';
import { useAuth } from '../../context/AuthContext';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login: React.FC<LoginPageProps> = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();

  const onFinish = async (values: any) => {
    setError(null);
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      if (response.user.role === 'Customer') {
        navigate('/menu');
      } else {
        navigate('/item-list');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff7e6' }}>
      <Card
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderColor: '#ffa940' }}
        title={<Title level={3} style={{ textAlign: 'center', margin: 0, color: '#d46b08' }}>Login</Title>}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={4}>PizzaHouse</Title>
          <Text type="secondary">Welcome back! Please login to your account.</Text>
        </div>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a onClick={handleForgotPassword}>Forgot Password?</a>
            <a onClick={handleRegister}>Register now!</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
