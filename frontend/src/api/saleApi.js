const _BASE = import.meta.env.VITE_API_URL || ''
const API_URL = _BASE
  ? (_BASE.replace(/\/$/, '').endsWith('/api')
      ? _BASE.replace(/\/$/, '')
      : _BASE.replace(/\/$/, '') + '/api')
  : '/api'

export const getSales = async () => {
  const res = await fetch(`${API_URL}/sales`)
  if (!res.ok) throw new Error('Failed to fetch sales')
  return res.json()
}

export const createSale = async (itemId, qty) => {
  const res = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, qty })
  })

  if (!res.ok) throw new Error('Failed to record sale')

  return res.json()
}