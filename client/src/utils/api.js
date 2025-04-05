// client/src/utils/api.js
/**
 * Revize Özeti:
 * - API_BASE URL'i güncellendi
 * - Hata mesajları iyileştirildi
 */

const API_BASE = 'http://localhost:5000/api/contracts';

export const getContracts = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Sunucudan veri alınamadı (HTTP ${response.status})`);
  }
  return await response.json();
};

export const saveContract = async (contract) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contract)
  });
  if (!response.ok) throw new Error('Sözleşme kaydedilemedi');
  return await response.json();
};

export const deleteContract = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, { 
    method: 'DELETE' 
  });
  if (!response.ok) throw new Error('Sözleşme silinemedi');
  return await response.json();
};
