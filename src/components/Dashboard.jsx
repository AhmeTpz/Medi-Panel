import React from 'react';
import { Card, Button, Typography, Space } from 'antd';

const { Title } = Typography;

const Dashboard = ({ user, onSelect, onLogout }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5', // Arka plan rengi
    }}>
      <Card
        style={{
          minWidth: 350,
          padding: 24,
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <Title level={3}>Hoşgeldiniz, {user.tc}</Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button type="primary" block onClick={() => onSelect('randevuAl')}>
            Randevu Al
          </Button>
          <Button block onClick={() => onSelect('randevularim')}>
            Randevularım
          </Button>
          <Button danger block onClick={onLogout}>
            Çıkış Yap
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
