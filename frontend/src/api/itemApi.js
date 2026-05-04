const _BASE = import.meta.env.VITE_API_URL || ''
const API_URL = _BASE
  ? (_BASE.replace(/\/$/, '').endsWith('/api')
      ? _BASE.replace(/\/$/, '')
      : _BASE.replace(/\/$/, '') + '/api')
  : '/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getItems = async () => {
  const res = await fetch(`${API_URL}/items`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export const createItem = async (data) => {
  const res = await fetch(`${API_URL}/items/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export const buyItem = async (id) => {
  const res = await fetch(`${API_URL}/items/${id}/buy`, { method: 'PUT', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to buy item')
  return res.json()
}

export const deleteItem = async (id) => {
  await fetch(`${API_URL}/items/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
}