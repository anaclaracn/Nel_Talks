//Um utilitário simples pra facilitar as requisições internas
import fetch from 'node-fetch';

export async function callAPI(url, body) {
  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  });
  
  return response.json();
}
