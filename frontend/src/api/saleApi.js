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

export const createSale = async (itemId, qty, unitPrice, saleType) => {
  const body = { qty }
  if (unitPrice !== undefined && unitPrice !== null) body.unitPrice = unitPrice
  if (saleType) body.saleType = saleType

  const res = await fetch(`${API_BASE}/sales/${itemId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error('Failed to record sale')

  return res.json()
}

export const createManualSale = async ({ description, qty, unitPrice, saleType }) => {
  const body = { description, qty }
  if (unitPrice !== undefined && unitPrice !== null) body.unitPrice = unitPrice
  if (saleType) body.saleType = saleType

  const res = await fetch(`${API_BASE}/sales/manual`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error('Failed to record sale')

  return res.json()
}

export const deleteSale = async (id) => {
  const res = await fetch(`${API_BASE}/sales/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })

  if (!res.ok) throw new Error('Failed to delete sale')
}