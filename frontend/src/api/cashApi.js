import { API_BASE } from './apiBase'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getCashRecords = async () => {
  const res = await fetch(`${API_BASE}/cash`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch cash records')
  return res.json()
}

export const createCashRecord = async (data) => {
  const res = await fetch(`${API_BASE}/cash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create cash record')
  return res.json()
}

export const markPaid = async (id) => {
  const res = await fetch(`${API_URL}/cash/${id}/pay`, { method: 'PUT', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to mark cash record as paid')
  return res.json()
}

export const markUnpaid = async (id) => {
  const res = await fetch(`${API_BASE}/cash/${id}/pay`, { method: 'PUT', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to mark cash record as unpaid')
  return res.json()
}

export const deleteCash = async (id) => {
  const res = await fetch(`${API_BASE}/cash/${id}/unpay`, { method: 'PUT', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to delete cash record')
}