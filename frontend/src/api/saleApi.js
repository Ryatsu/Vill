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

export const getSales = async () => {
  const res = await fetch(`${API_URL}/sales`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch sales')
  return res.json()
}

export const createSale = async (itemId, qty) => {
  const res = await fetch(`${API_URL}/sales/${itemId}?qty=${qty}`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })

  if (!res.ok) throw new Error('Failed to record sale')

  return res.json()
}