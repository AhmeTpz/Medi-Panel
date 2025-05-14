import React, { useEffect, useState } from 'react';
import { Form, Button, Select, DatePicker, message, Spin, Typography, Space } from 'antd';
import dayjs from 'dayjs';
import { doktorlariGetir, randevulariGetir, randevuEkle } from '../api/randevuApi';
import background from '../assets/background.jpg';

const { Option } = Select;
const { Title } = Typography;

const SAATLER = ['08:00', '09:00', '10:00', '11:00','12:00','14:00','15:00','16:00'];

const RandevuAl = ({ user, onBack, onRandevuHazirla }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPoliklinik, setSelectedPoliklinik] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();
  const [saatDolumu, setSaatDolumu] = useState({});
  const [checking, setChecking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const rows = await doktorlariGetir();
        setDoctors(
          rows
            .filter(row => row[0] !== 'ID')
            .map(row => ({
              ID: row[0],
              DoktorAd: row[1],
              Alan: row[2],
              MailAdresi: row[3],
              TelNO: row[4],
              Durum: row[5]
            }))
        );
      } catch (error) {
        message.error('Doktor verileri alınamadı!');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const poliklinikler = Array.from(new Set(doctors.map(doc => doc.Alan)));

  const onPoliklinikChange = (value) => {
    setSelectedPoliklinik(value);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    form.setFieldsValue({ doctor: undefined, date: undefined });
    setSaatDolumu({});
  };

  const onDoctorChange = (value) => {
    setSelectedDoctor(value);
    form.setFieldsValue({ date: undefined });
    setSelectedTime(null);
    setSaatDolumu({});
  };


  const fetchSaatDoluluk = async (doktorID, tarih) => {
    try {
      const rows = await randevulariGetir();
      const dataRows = rows.filter(row => row[0] !== 'ID');
      const doluSaatler = {};
      SAATLER.forEach(saat => {
        const count = dataRows.filter(r =>
          String(r[2]) === String(doktorID) &&
          String(r[3]) === tarih.format('YYYY-MM-DD') &&
          String(r[4]) === saat
        ).length;
        doluSaatler[saat] = count >= 4;
      });
      setSaatDolumu(doluSaatler);
    } catch {
      message.error('Saat dolulukları alınamadı!');
      setSaatDolumu({});
    }
  };

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setSaatDolumu({});
      setSelectedTime(null);
      return;
    }
    setChecking(true);
    fetchSaatDoluluk(selectedDoctor, selectedDate)
      .finally(() => setChecking(false));
  }, [selectedDoctor, selectedDate]);

  const onFinish = async (values) => {
    if (!selectedTime) {
      message.error('Saat seçiniz!');
      return;
    }
    setLoading(true);
    try {
      const result = await randevuEkle({
        hastaTC: user.tc,
        doktorID: values.doctor,
        randevuTarih: values.date.format('YYYY-MM-DD'),
        randevuSaat: String(selectedTime)
      });

      if (result.success) {
        message.success('Randevu başarıyla oluşturuldu!');
        onBack();
      } else {
        message.error(result.message || 'Randevu eklenemedi!');
      }
    } catch (error) {
      message.error(error.message || 'Randevu kaydedilemedi!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" tip="Yükleniyor..." />
      </div>
    );
  }

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
      alignItems: 'center',
      overflow: 'auto',
      padding: 24
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#fff',
        padding: 24,
        borderRadius: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <Title level={4} style={{ textAlign: 'center' }}>Randevu Al</Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Poliklinik" name="poliklinik" rules={[{ required: true, message: 'Poliklinik seçiniz!' }]}>
            <Select placeholder="Poliklinik seçiniz" onChange={onPoliklinikChange} allowClear>
              {poliklinikler.map((alan) => (
                <Option key={alan} value={alan}>{alan}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Doktor" name="doctor" rules={[{ required: true, message: 'Doktor seçiniz!' }]}>
            <Select 
              placeholder="Doktor seçiniz" 
              disabled={!selectedPoliklinik} 
              allowClear 
              onChange={onDoctorChange}
            >
              {doctors.filter(doc => doc.Alan === selectedPoliklinik).map((doc) => (
                <Option
                  key={doc.ID}
                  value={doc.ID}
                  disabled={doc.Durum === 'B'}
                  style={doc.Durum === 'B' ? { color: '#bbb' } : {}}
                >
                  {doc.DoktorAd}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Tarih" name="date" rules={[{ required: true, message: 'Tarih seçiniz!' }]}>
            <DatePicker 
              style={{ width: '100%' }} 
              disabledDate={d => d && d < dayjs().startOf('day')} 
              disabled={!selectedPoliklinik || !selectedDoctor}
              onChange={value => {
                setSelectedDate(value);
                setSelectedTime(null);
              }}
            />
          </Form.Item>
          <Form.Item label="Saat" required>
            <Space wrap>
              {SAATLER.map(saat => {
                const isToday = selectedDate && selectedDate.isSame(dayjs(), 'day');
                const currentTime = dayjs();
                const appointmentTime = isToday ? dayjs(saat, 'HH:mm') : null;
                const isPastTime = isToday && appointmentTime.isBefore(currentTime);
                
                return (
                  <Button
                    key={saat}
                    type={selectedTime === saat ? 'primary' : 'default'}
                    onClick={() => setSelectedTime(saat)}
                    disabled={
                      checking ||
                      !selectedDoctor ||
                      !selectedDate ||
                      saatDolumu[saat] === true ||
                      isPastTime
                    }
                    style={saatDolumu[saat] || isPastTime ? { background: '#eee', color: '#aaa', borderColor: '#ccc' } : {}}
                    title={saatDolumu[saat] ? 'Bu saat dolu' : isPastTime ? 'Geçmiş saat' : 'Uygun'}
                  >
                    {saat}
                  </Button>
                );
              })}
            </Space>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={!selectedTime}>Randevu Al</Button>
          </Form.Item>
          <Form.Item>
            <Button block onClick={onBack}>Geri Dön</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RandevuAl;
