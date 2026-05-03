const API = '/api/items'

export const getItems = async () => {
  const res = await fetch(API)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export const createItem = async (data) => {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export const buyItem = async (id) => {
  const res = await fetch(`${API}/${id}/buy`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to buy item')
  return res.json()
}

export const deleteItem = async (id) => {
  await fetch(`${API}/${id}`, { method: 'DELETE' })
}