# MediPortal – Online Randevu Sistemi

**MediPortal**, bir öğrenci projesi olarak geliştirilmiş, kullanıcıların doktor seçerek uygun tarih ve saatlerde randevu almasını sağlayan basit ve etkili bir online randevu sistemidir. Veriler Google Sheets üzerinden saklanır ve kontrol edilir.

## 🚀 Proje Özellikleri

- ✅ Doktor → Tarih → Saat seçim sıralaması
- ✅ Aynı doktor ve saat için maksimum 4 randevu kontrolü
- ✅ Google Sheets bağlantılı veri yönetimi
- ✅ React + Ant Design arayüz
- ✅ Node.js + Express.js API
- ✅ Gerçek zamanlı saat doluluk kontrolü

## 🖥️ Kullanılan Teknolojiler

| Katman     | Teknoloji            |
| ---------- | -------------------- |
| Frontend   | React + Ant Design   |
| Backend    | Node.js + Express.js |
| Veritabanı | Google Sheets API    |
| Diğer      | Axios, Day.js, CORS  |

## 📁 Proje Yapısı

```
mediportal/
├── client/                  # React uygulaması (kullanıcı arayüzü)
│   ├── components/
│   ├── assets/              # Logo ve simgeler
│   └── App.jsx
├── server/                  # Node.js API
│   ├── server.js            # Express sunucusu
│   └── service-account.json
└── README.md
```

## ⚙️ Kurulum ve Başlatma

### 1. Google Sheets Hazırlığı

- Google Sheets üzerinde iki sayfa oluştur:

  - `DoctorList`: Doktor ID, Adı, Branşı, Cinsiyet, Mail, vb.
  - `DateList`: Randevu kayıtları (ID, Hasta TC, DoktorID, Tarih, Saat vb.)

- Google Cloud Console üzerinden bir servis hesabı oluştur ve `.json` dosyasını `server` klasörüne ekle.

### 2. Backend (API) Başlatma

```bash
cd server
npm install
node server.js
```

### 3. Frontend (React) Başlatma

```bash
cd client
npm install
npm run dev
```

> Sunucu: `http://localhost:5000`> Uygulama: `http://localhost:5173`

## 📸 Ekran Görüntüsü

Ana sayfa, saat seçimi ve alınan randevular ekranına ait örnekler `assets/` klasöründe yer alabilir.

## 📌 Notlar

- Bu proje bireysel/öğrenci projesi olarak geliştirilmiştir.
- Gerçek hastane verisi içermez, yalnızca demo amaçlıdır.

---

**Geliştirici:** Ahmet TOPUZ Tarih: 2025
