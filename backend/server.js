const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const spreadsheetId = '1xM-lmO2Xhl-0exBmfq4wpnkqkbuFT_RIazWTpaEs_cI';
const sheetRandevu = 'DateList';
const sheetDoktor = 'DoctorList';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

app.get('/api/doktorlar', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetDoktor
    });
    res.json(result.data.values || []);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Doktorlar alınamadı' });
  }
});

app.get('/api/randevular', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRandevu
    });
    res.json(result.data.values || []);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Randevular alınamadı' });
  }
});

app.post('/api/randevu-ekle', async (req, res) => {
  const { hastaTC, doktorID, randevuTarih, randevuSaat } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const now = new Date();
    const kayitSaat = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const kayitTarih = randevuTarih;
    const id = String(Date.now());

    const yeniSatir = [[
      id,
      hastaTC,
      doktorID,
      randevuTarih,
      randevuSaat,
      kayitTarih,
      kayitSaat
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetRandevu,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: yeniSatir }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Randevu eklenemedi' });
  }
});

app.get('/api/randevularim', async (req, res) => {
  const { tc } = req.query;
  if (!tc) return res.status(400).json({ success: false, message: 'TC zorunlu' });

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const [randevuSheet, doktorSheet] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: sheetRandevu }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: sheetDoktor })
    ]);

    const doktorVerileri = doktorSheet.data.values || [];
    const doktorlar = doktorVerileri.slice(1);

    const randevuVerileri = randevuSheet.data.values || [];
    const randevular = randevuVerileri.filter(r => r[0] !== 'ID');
    const kullaniciRandevular = randevular.filter(r => String(r[1]) === String(tc));

    const sonuc = kullaniciRandevular.map(r => {
      const doktor = doktorlar.find(d => d[0] === r[2]);

      return {
        doktorAd: doktor ? doktor[1] : '',
        poliklinik: doktor ? doktor[2] : '',
        randevuTarih: r[3],
        randevuSaat: r[4],
        mail: doktor ? doktor[3] : '',
        tel: doktor ? doktor[4] : '',
        cinsiyet: doktor && doktor[6] ? doktor[6] : 'E'
      };
    });

    res.json(sonuc);
  } catch (err) {
    console.error('Randevular alınırken hata:', err);
    res.status(500).json({ success: false, message: 'Randevular alınamadı' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🟢 Server çalışıyor: http://localhost:${PORT}`);
});
