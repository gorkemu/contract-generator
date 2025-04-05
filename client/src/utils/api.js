const API_BASE = '/api/contracts';

export const getContracts = async () => {
  const response = await fetch(API_BASE);
  return await response.json();
};

export const saveContract = async (contract) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contract)
  });
  return await response.json();
};