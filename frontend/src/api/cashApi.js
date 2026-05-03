const _BASE = import.meta.env.VITE_API_URL || ''
const API_URL = _BASE
  ? (_BASE.replace(/\/$/, '').endsWith('/api')
      ? _BASE.replace(/\/$/, '')
      : _BASE.replace(/\/$/, '') + '/api')
  : '/api'

export const getCashRecords = async () => {
  const res = await fetch(`${API_URL}/cash`)
  if (!res.ok) throw new Error('Failed to fetch cash records')
  return res.json()
}

export const createCashRecord = async (data) => {
  const res = await fetch(`${API_URL}/cash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create cash record')
  return res.json()
}

export const markPaid = async (id) => {
  const res = await fetch(`${API_URL}/cash/${id}/pay`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to mark cash record as paid')
  return res.json()
}

export const markUnpaid = async (id) => {
  const res = await fetch(`${API_URL}/cash/${id}/unpay`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to mark cash record as unpaid')
  return res.json()
}

export const deleteCash = async (id) => {
  const res = await fetch(`${API_URL}/cash/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete cash record')
}