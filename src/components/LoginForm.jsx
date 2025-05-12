import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

const fakeUsers = [
  { tc: '12345678901', password: '1234' },
  { tc: '11111111111', password: 'abcd' }
];

const LoginForm = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Sadece bu component için mesaj gösterilsin
    message.config({
      getContainer: () => messageContainerRef.current
    });
  }, []);

  const onFinish = (values) => {
    message.destroy();
    setLoading(true);

    setTimeout(() => {
      const user = fakeUsers.find(
        (u) => u.tc === values.tc && u.password === values.password
      );

      if (user) {
        message.success('Giriş başarılı!');
        setTimeout(() => {
          onLogin(user);
        }, 1500);
      } else {
        message.error('TC veya şifre hatalı!');
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div ref={messageContainerRef} style={{
      width: '100%',
      maxWidth: 360,
      margin: 16,
      padding: 24,
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      position: 'relative', // mesajlar burada gösterilsin diye
      zIndex: 1
    }}>
      <Title level={3} style={{ textAlign: 'center' }}>Hasta Girişi</Title>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="TC Kimlik No"
          name="tc"
          rules={[
            { required: true, message: 'TC Kimlik No giriniz!' },
            { len: 11, message: 'TC Kimlik No 11 haneli olmalı!' }
          ]}
        >
          <Input maxLength={11} autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: 'Şifre giriniz!' }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
