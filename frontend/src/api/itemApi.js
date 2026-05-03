const _BASE = import.meta.env.VITE_API_URL || ''
const API_URL = _BASE
  ? (_BASE.replace(/\/$/, '').endsWith('/api')
      ? _BASE.replace(/\/$/, '')
      : _BASE.replace(/\/$/, '') + '/api')
  : '/api'

export const getItems = async () => {
  const res = await fetch(`${API_URL}/items`)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export const createItem = async (data) => {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export const buyItem = async (id) => {
  const res = await fetch(`${API_URL}/items/${id}/buy`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to buy item')
  return res.json()
}

export const deleteItem = async (id) => {
  await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
}