export async function randevuEkle({ hastaTC, doktorID, randevuTarih, randevuSaat }) {
  try {
    const response = await fetch('http://localhost:5000/api/randevu-ekle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hastaTC, doktorID, randevuTarih, randevuSaat })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Randevu eklenirken hata:', error);
    throw error;
  }
}

export async function randevulariGetir() {
  try {
    const response = await fetch('http://localhost:5000/api/randevular');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Randevular alınırken hata:', error);
    throw error;
  }
}

export async function doktorlariGetir() {
  try {
    const response = await fetch('http://localhost:5000/api/doktorlar');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Doktorlar alınırken hata:', error);
    throw error;
  }
}