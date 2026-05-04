import { API_BASE } from './apiBase'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getSales = async () => {
  const res = await fetch(`${API_BASE}/sales`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch sales')
  return res.json()
}

export const createSale = async (itemId, qty) => {
  const res = await fetch(`${API_BASE}/sales/${itemId}?qty=${qty}`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })

  if (!res.ok) throw new Error('Failed to record sale')

  return res.json()
}