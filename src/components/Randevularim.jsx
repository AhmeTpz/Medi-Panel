import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Typography, Spin, message, Empty } from 'antd';
import docMan from '../assets/docman.svg';
import docWoman from '../assets/docwoman.svg';
import background from '../assets/background.jpg';
import { kullaniciRandevulariniGetir } from '../api/randevuApi';

const { Title, Text } = Typography;

const Randevularim = ({ user, onBack }) => {
  const [randevular, setRandevular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRandevular() {
      setLoading(true);
      try {
        const res = await kullaniciRandevulariniGetir(user.tc);
        setRandevular(res);
      } catch (err) {
        message.error('Randevular alınamadı!');
      } finally {
        setLoading(false);
      }
    }
    fetchRandevular();
  }, [user.tc]);

  const getAvatar = (cinsiyet) => {
    if (cinsiyet === 'K') return docWoman;
    return docMan;
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflow: 'auto',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 600,
        background: '#fff',
        padding: 24,
        borderRadius: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>Randevularım</Title>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin tip="Yükleniyor..." size="large" />
          </div>
        ) : randevular.length === 0 ? (
          <Empty description="Hiç randevunuz yok." />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={randevular}
            renderItem={item => (
              <Card style={{ marginBottom: 16 }}>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={getAvatar(item.cinsiyet)} size={48} />}
                    title={<Text strong style={{ fontSize: 18 }}>{item.doktorAd}</Text>}
                    description={<Text type="secondary">{item.poliklinik}</Text>}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text><b>Randevu Tarihi:</b> {item.randevuTarih}</Text><br />
                    <Text><b>Saat:</b> {item.randevuSaat}</Text><br />
                    <Text><b>Mail:</b> {item.mail}</Text><br />
                    <Text><b>Telefon:</b> {item.tel}</Text>
                  </div>
                </List.Item>
              </Card>
            )}
          />
        )}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a onClick={onBack} style={{ color: '#1890ff', cursor: 'pointer' }}>Geri Dön</a>
        </div>
      </div>
    </div>
  );
};

export default Randevularim;